import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "image" or "video"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const allowedVideoTypes = ["video/mp4", "video/mov", "video/avi", "video/webm"]
    
    if (type === "image" && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid image format. Use JPEG, PNG, or WebP" }, { status: 400 })
    }
    
    if (type === "video" && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid video format. Use MP4, MOV, AVI, or WebM" }, { status: 400 })
    }

    // Validate file size (5MB for images, 50MB for videos)
    const maxSize = type === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Max size: ${type === "image" ? "5MB" : "50MB"}` 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Create subdirectories for images and videos
    const typeDir = join(uploadsDir, type === "image" ? "images" : "videos")
    if (!existsSync(typeDir)) {
      await mkdir(typeDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`
    const filepath = join(typeDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return the public URL
    const publicUrl = `/uploads/${type === "image" ? "images" : "videos"}/${filename}`

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: filename
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}


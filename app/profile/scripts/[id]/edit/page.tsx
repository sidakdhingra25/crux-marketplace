"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import {
  Upload,
  Plus,
  X,
  Code,
  FileText,
  Sparkles,
  ImageIcon,
  Video,
  ExternalLink,
  Package,
  Zap,
  Star,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Tag,
  Settings,
  ArrowLeft,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Script {
  id: number
  title: string
  description: string
  price: number
  original_price?: number
  category: string
  framework?: string
  seller_name: string
  seller_email: string
  seller_id?: string
  tags: string[]
  features: string[]
  requirements: string[]
  images: string[]
  videos: string[]
  screenshots: string[]
  cover_image?: string
  demo_url?: string
  documentation_url?: string
  support_url?: string
  version: string
  last_updated: string
  status: "pending" | "approved" | "rejected"
  featured: boolean
  downloads: number
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

const scriptCategories = [
  { value: "utility", label: "Utility" },
  { value: "gameplay", label: "Gameplay" },
  { value: "ui", label: "UI/UX" },
  { value: "admin", label: "Admin Tools" },
  { value: "economy", label: "Economy" },
  { value: "vehicles", label: "Vehicles" },
  { value: "jobs", label: "Jobs" },
  { value: "housing", label: "Housing" },
  { value: "weapons", label: "Weapons" },
  { value: "other", label: "Other" },
]

const frameworks = [
  { value: "standalone", label: "Standalone" },
  { value: "esx", label: "ESX" },
  { value: "qb-core", label: "QB-Core" },
  { value: "vRP", label: "vRP" },
  { value: "other", label: "Other" },
]

export default function EditScriptPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const scriptId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [script, setScript] = useState<Script | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    framework: "",
    sellerName: "",
    sellerEmail: "",
    version: "1.0.0",
    demoUrl: "",
    documentationUrl: "",
    supportUrl: "",
    featured: false,
  })

  const [features, setFeatures] = useState([{ id: 1, text: "" }])
  const [requirements, setRequirements] = useState([{ id: 1, text: "" }])
  const [tags, setTags] = useState([{ id: 1, text: "" }])
  const [media, setMedia] = useState<{
    images: string[]
    videos: string[]
    screenshots: string[]
    coverImage: string | null
    thumbnail: string | null
  }>({
    images: [],
    videos: [],
    screenshots: [],
    coverImage: null,
    thumbnail: null,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/")
      return
    }

    fetchScript()
  }, [session, status, router, scriptId])

  const fetchScript = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/scripts/${scriptId}`)
      
      if (!response.ok) {
        throw new Error("Script not found")
      }

      const scriptData = await response.json()
      
      // Check if user owns this script
      if (scriptData.seller_id !== (session?.user as any)?.id) {
        router.push("/profile")
        return
      }

      setScript(scriptData)
      
      // Populate form data
      setFormData({
        title: scriptData.title,
        description: scriptData.description,
        price: scriptData.price.toString(),
        originalPrice: scriptData.original_price?.toString() || "",
        category: scriptData.category,
        framework: scriptData.framework || "",
        sellerName: scriptData.seller_name,
        sellerEmail: scriptData.seller_email,
        version: scriptData.version,
        demoUrl: scriptData.demo_url || "",
        documentationUrl: scriptData.documentation_url || "",
        supportUrl: scriptData.support_url || "",
        featured: scriptData.featured,
      })

      // Populate arrays
      setFeatures(scriptData.features.map((feature: string, index: number) => ({ id: index + 1, text: feature })))
      setRequirements(scriptData.requirements.map((req: string, index: number) => ({ id: index + 1, text: req })))
      setTags(scriptData.tags.map((tag: string, index: number) => ({ id: index + 1, text: tag })))
      
      setMedia({
        images: scriptData.images || [],
        videos: scriptData.videos || [],
        screenshots: scriptData.screenshots || [],
        coverImage: scriptData.cover_image || null,
        thumbnail: null,
      })

    } catch (error) {
      console.error("Error fetching script:", error)
      router.push("/profile")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, type: "image" | "video", purpose: string = "screenshot") => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)
      formData.append("purpose", purpose)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const result = await response.json()
      return result.url
    } catch (error) {
      console.error("Upload error:", error)
      alert(`Failed to upload ${type}: ${error instanceof Error ? error.message : "Unknown error"}`)
      return null
    }
  }

  const handleScreenshotUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newScreenshots: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (media.screenshots.length + newScreenshots.length >= 10) {
        alert("Maximum 10 screenshots allowed")
        break
      }

      const url = await handleFileUpload(file, "image", "screenshot")
      if (url) {
        newScreenshots.push(url)
      }
    }

    if (newScreenshots.length > 0) {
      setMedia(prev => ({
        ...prev,
        screenshots: [...prev.screenshots, ...newScreenshots]
      }))
    }
  }

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const url = await handleFileUpload(file, "image", "cover")
    if (url) {
      setMedia(prev => ({
        ...prev,
        coverImage: url
      }))
    }
  }

  const removeCoverImage = () => {
    setMedia(prev => ({
      ...prev,
      coverImage: null
    }))
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newVideos: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const url = await handleFileUpload(file, "video", "demo")
      if (url) {
        newVideos.push(url)
      }
    }

    if (newVideos.length > 0) {
      setMedia(prev => ({
        ...prev,
        videos: [...prev.videos, ...newVideos]
      }))
    }
  }

  const removeScreenshot = (index: number) => {
    setMedia(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }))
  }

  const removeVideo = (index: number) => {
    setMedia(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
  }

  const addFeature = () => {
    const newId = Math.max(...features.map((f) => f.id), 0) + 1
    setFeatures([...features, { id: newId, text: "" }])
  }

  const removeFeature = (id: number) => {
    setFeatures(features.filter((f) => f.id !== id))
  }

  const updateFeature = (id: number, text: string) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, text } : f)))
  }

  const addRequirement = () => {
    const newId = Math.max(...requirements.map((r) => r.id), 0) + 1
    setRequirements([...requirements, { id: newId, text: "" }])
  }

  const removeRequirement = (id: number) => {
    setRequirements(requirements.filter((r) => r.id !== id))
  }

  const updateRequirement = (id: number, text: string) => {
    setRequirements(requirements.map((r) => (r.id === id ? { ...r, text } : r)))
  }

  const addTag = () => {
    const newId = Math.max(...tags.map((t) => t.id), 0) + 1
    setTags([...tags, { id: newId, text: "" }])
  }

  const removeTag = (id: number) => {
    setTags(tags.filter((t) => t.id !== id))
  }

  const updateTag = (id: number, text: string) => {
    setTags(tags.map((t) => (t.id === id ? { ...t, text } : t)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const scriptData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        original_price: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : null,
        seller_name: formData.sellerName,
        seller_email: formData.sellerEmail,
        demo_url: formData.demoUrl,
        documentation_url: formData.documentationUrl,
        support_url: formData.supportUrl,
        features: features.filter((f) => f.text.trim()).map((f) => f.text.trim()),
        requirements: requirements.filter((r) => r.text.trim()).map((r) => r.text.trim()),
        tags: tags.filter((t) => t.text.trim()).map((t) => t.text.trim()),
        images: media.images,
        videos: media.videos,
        screenshots: media.screenshots,
        cover_image: media.coverImage,
        last_updated: new Date().toISOString(),
      }

      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scriptData),
      })

      if (response.ok) {
        alert("Script updated successfully!")
        router.push("/profile")
      } else {
        throw new Error("Failed to update script")
      }
    } catch (error) {
      console.error("Error updating script:", error)
      alert("Error updating script. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const discount =
    formData.originalPrice && formData.price
      ? Math.round(
          ((Number.parseFloat(formData.originalPrice) - Number.parseFloat(formData.price)) /
            Number.parseFloat(formData.originalPrice)) *
            100,
        )
      : 0

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </>
    )
  }

  if (!session || !script) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-400/10 py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button
                variant="outline"
                onClick={() => router.push("/profile")}
                className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Edit Script</h1>
                <p className="text-gray-400">Update your script information</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-500" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-white font-medium">
                      Script Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter script title..."
                      className="mt-2 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white font-medium">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your script..."
                      rows={4}
                      className="mt-2 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-white font-medium">
                        Category *
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="mt-2 bg-gray-900/50 border-gray-700 text-white focus:border-orange-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {scriptCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value} className="text-white">
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="framework" className="text-white font-medium">
                        Framework
                      </Label>
                      <Select value={formData.framework} onValueChange={(value) => setFormData({ ...formData, framework: value })}>
                        <SelectTrigger className="mt-2 bg-gray-900/50 border-gray-700 text-white focus:border-orange-500">
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {frameworks.map((framework) => (
                            <SelectItem key={framework.value} value={framework.value} className="text-white">
                              {framework.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-orange-500" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-white font-medium">
                        Price (USD) *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="25.99"
                        className="mt-2 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="originalPrice" className="text-white font-medium">
                        Original Price (Optional)
                      </Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        placeholder="35.99"
                        className="mt-2 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="version" className="text-white font-medium">
                        Version
                      </Label>
                      <Input
                        id="version"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        placeholder="1.0.0"
                        className="mt-2 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {discount > 0 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-400 font-semibold">
                          {discount}% Discount - Save $
                          {(Number.parseFloat(formData.originalPrice) - Number.parseFloat(formData.price)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured" className="text-white">
                      Request Featured Listing (+$20 review fee)
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Input
                        value={feature.text}
                        onChange={(e) => updateFeature(feature.id, e.target.value)}
                        placeholder="Describe a key feature..."
                        className="flex-1 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(feature.id)}
                        className="text-red-400 hover:text-red-300 border-red-500/30"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                  <Button type="button" variant="outline" onClick={addFeature} className="w-full border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {requirements.map((req, index) => (
                    <motion.div
                      key={req.id}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Input
                        value={req.text}
                        onChange={(e) => updateRequirement(req.id, e.target.value)}
                        placeholder="Add a requirement..."
                        className="flex-1 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRequirement(req.id)}
                        className="text-red-400 hover:text-red-300 border-red-500/30"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                  <Button type="button" variant="outline" onClick={addRequirement} className="w-full border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </Button>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Tag className="h-5 w-5 text-orange-500" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tags.map((tag, index) => (
                    <motion.div
                      key={tag.id}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Input
                        value={tag.text}
                        onChange={(e) => updateTag(tag.id, e.target.value)}
                        placeholder="Add a tag..."
                        className="flex-1 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeTag(tag.id)}
                        className="text-red-400 hover:text-red-300 border-red-500/30"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                  <Button type="button" variant="outline" onClick={addTag} className="w-full border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </CardContent>
              </Card>

              {/* Links */}
              <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-orange-500" />
                    Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="demoUrl" className="text-white font-medium">
                      Demo URL
                    </Label>
                    <Input
                      id="demoUrl"
                      type="url"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                      placeholder="https://example.com/demo"
                      className="mt-2 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="documentationUrl" className="text-white font-medium">
                      Documentation URL
                    </Label>
                    <Input
                      id="documentationUrl"
                      type="url"
                      value={formData.documentationUrl}
                      onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                      placeholder="https://example.com/docs"
                      className="mt-2 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supportUrl" className="text-white font-medium">
                      Support URL
                    </Label>
                    <Input
                      id="supportUrl"
                      type="url"
                      value={formData.supportUrl}
                      onChange={(e) => setFormData({ ...formData, supportUrl: e.target.value })}
                      placeholder="https://example.com/support"
                      className="mt-2 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Media & Screenshots */}
              <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-orange-500" />
                    Media & Screenshots
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-white font-medium">Cover Image *</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                      id="cover-image-upload"
                    />
                    <label
                      htmlFor="cover-image-upload"
                      className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer block"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Upload cover image</p>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB (will be displayed on scripts listing)</p>
                    </label>
                    
                    {/* Display uploaded cover image */}
                    {media.coverImage && (
                      <div className="mt-4">
                        <div className="relative group">
                          <img
                            src={media.coverImage}
                            alt="Cover image"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeCoverImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-white font-medium">Screenshots *</Label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label
                      htmlFor="screenshot-upload"
                      className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer block"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Upload script screenshots</p>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB each (max 10 images)</p>
                    </label>
                    
                    {/* Display uploaded screenshots */}
                    {media.screenshots.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {media.screenshots.map((screenshot, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={screenshot}
                              alt={`Screenshot ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeScreenshot(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-white font-medium">Demo Videos (Optional)</Label>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer block"
                    >
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Upload demo videos</p>
                      <p className="text-sm text-gray-500 mt-2">MP4, MOV up to 50MB each</p>
                    </label>
                    
                    {/* Display uploaded videos */}
                    {media.videos.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {media.videos.map((video, index) => (
                          <div key={index} className="relative group">
                            <video
                              src={video}
                              controls
                              className="w-full rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <motion.div className="flex gap-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-3 text-lg shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Settings className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  className="px-8 border-gray-600 text-gray-300 hover:text-white hover:border-orange-500"
                >
                  Cancel
                </Button>
              </motion.div>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Screenshots Preview */}
                      {media.screenshots.length > 0 ? (
                        <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={media.screenshots[0]}
                            alt="Main screenshot"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-500" />
                        </div>
                      )}
                      
                      {/* Additional Screenshots */}
                      {media.screenshots.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {media.screenshots.slice(1, 4).map((screenshot, index) => (
                            <div key={index} className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                              <img
                                src={screenshot}
                                alt={`Screenshot ${index + 2}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {media.screenshots.length > 4 && (
                            <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-sm">+{media.screenshots.length - 4}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <h3 className="text-white font-bold text-lg">{formData.title || "Your Script Title"}</h3>
                        <p className="text-gray-400 text-sm mt-2">
                          {formData.description || "Your script description will appear here..."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500 font-bold text-xl">${formData.price || "0.00"}</span>
                          {formData.originalPrice && (
                            <span className="text-gray-500 line-through text-sm">${formData.originalPrice}</span>
                          )}
                        </div>
                        {discount > 0 && <Badge className="bg-red-500 text-white">-{discount}%</Badge>}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {formData.category && (
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            {scriptCategories.find((c) => c.value === formData.category)?.label}
                          </Badge>
                        )}
                        {formData.framework && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {frameworks.find((f) => f.value === formData.framework)?.label}
                          </Badge>
                        )}
                        {formData.featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {features.filter((f) => f.text.trim()).length > 0 && (
                        <div>
                          <h4 className="text-white font-semibold mb-2">Features:</h4>
                          <ul className="space-y-1">
                            {features
                              .filter((f) => f.text.trim())
                              .slice(0, 3)
                              .map((feature, index) => (
                                <li key={index} className="text-gray-400 text-sm flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {feature.text}
                                </li>
                              ))}
                            {features.filter((f) => f.text.trim()).length > 3 && (
                              <li className="text-gray-500 text-sm">
                                +{features.filter((f) => f.text.trim()).length - 3} more features
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {tags.filter((t) => t.text.trim()).length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tags
                            .filter((t) => t.text.trim())
                            .slice(0, 5)
                            .map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag.text}
                              </Badge>
                            ))}
                          {tags.filter((t) => t.text.trim()).length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{tags.filter((t) => t.text.trim()).length - 5}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

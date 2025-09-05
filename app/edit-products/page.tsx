"use client"

import { useEffect, useState } from "react"
import { updateScript, updateGiveaway, getScripts, getGiveaways } from "@/lib/database-new"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Placeholder for user email (replace with real auth/session)
const USER_EMAIL = "demo@user.com"

export default function EditProductsPage() {
  const [scripts, setScripts] = useState<any[]>([])
  const [giveaways, setGiveaways] = useState<any[]>([])
  const [editing, setEditing] = useState<{ type: "script" | "giveaway"; id: number } | null>(null)
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Fetch user's scripts and giveaways
    async function fetchData() {
      // You may want to filter by seller_email/creator_email
      const allScripts = await getScripts()
      const allGiveaways = await getGiveaways()
      setScripts(allScripts.filter((s: any) => s.seller_email === USER_EMAIL))
      setGiveaways(allGiveaways.filter((g: any) => g.creator_email === USER_EMAIL))
    }
    fetchData()
  }, [])

  const handleEdit = (type: "script" | "giveaway", item: any) => {
    setEditing({ type, id: item.id })
    setForm(item)
    setMessage("")
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (editing?.type === "script") {
        await updateScript(editing.id, form)
        setScripts((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s)))
      } else if (editing?.type === "giveaway") {
        await updateGiveaway(editing.id, form)
        setGiveaways((prev) => prev.map((g) => (g.id === editing.id ? { ...g, ...form } : g)))
      }
      setMessage("Saved!")
      setEditing(null)
    } catch (err) {
      setMessage("Error saving changes.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Edit Your Products</h1>
        {message && <div className="mb-4 text-green-400">{message}</div>}
        <h2 className="text-2xl font-semibold mb-4">Scripts</h2>
        <div className="space-y-4 mb-8">
          {scripts.map((script) => (
            <Card key={script.id} className="bg-gray-800/30 border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">{script.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {editing?.type === "script" && editing.id === script.id ? (
                  <div className="space-y-2">
                    <Input name="title" value={form.title} onChange={handleChange} className="bg-gray-900 text-white" />
                    <Input name="price" value={form.price} onChange={handleChange} className="bg-gray-900 text-white" type="number" />
                    <Input name="version" value={form.version} onChange={handleChange} className="bg-gray-900 text-white" />
                    <Input name="category" value={form.category} onChange={handleChange} className="bg-gray-900 text-white" />
                    <Button onClick={handleSave} disabled={loading} className="mt-2">Save</Button>
                    <Button variant="outline" onClick={() => setEditing(null)} className="ml-2 mt-2">Cancel</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{script.title}</div>
                      <div className="text-gray-400">${script.price} | v{script.version} | {script.category}</div>
                    </div>
                    <Button onClick={() => handleEdit("script", script)}>Edit</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <h2 className="text-2xl font-semibold mb-4">Giveaways</h2>
        <div className="space-y-4">
          {giveaways.map((giveaway) => (
            <Card key={giveaway.id} className="bg-gray-800/30 border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">{giveaway.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {editing?.type === "giveaway" && editing.id === giveaway.id ? (
                  <div className="space-y-2">
                    <Input name="title" value={form.title} onChange={handleChange} className="bg-gray-900 text-white" />
                    <Input name="total_value" value={form.total_value} onChange={handleChange} className="bg-gray-900 text-white" />
                    <Input name="category" value={form.category} onChange={handleChange} className="bg-gray-900 text-white" />
                    <Input name="end_date" value={form.end_date} onChange={handleChange} className="bg-gray-900 text-white" type="date" />
                    <Button onClick={handleSave} disabled={loading} className="mt-2">Save</Button>
                    <Button variant="outline" onClick={() => setEditing(null)} className="ml-2 mt-2">Cancel</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{giveaway.title}</div>
                      <div className="text-gray-400">Value: {giveaway.total_value} | Ends: {giveaway.end_date} | {giveaway.category}</div>
                    </div>
                    <Button onClick={() => handleEdit("giveaway", giveaway)}>Edit</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
} 
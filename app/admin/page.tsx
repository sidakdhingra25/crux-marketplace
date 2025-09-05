"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Package,
  Gift,
  Megaphone,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  TrendingUp,
  BarChart3,
  Shield,
  Crown,
  UserCheck,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FileUpload from "@/components/file-upload"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  username: string | null
  roles: string[]
  created_at?: string
}

interface Script {
  id: number
  title: string
  description: string
  price: number
  category: string
  framework?: string
  status: string
  seller_name: string
  created_at: string
  rejection_reason?: string
}

interface Giveaway {
  id: number
  title: string
  description: string
  total_value: string
  category: string
  difficulty: string
  status: string
  creator_name: string
  created_at: string
}

interface Ad {
  id: number
  title: string
  description: string
  category: string
  status: string
  priority: number
  created_at: string
}

const roleOptions = [
  { value: "user", label: "User", icon: Users, color: "bg-blue-500" },
  { value: "seller", label: "Seller", icon: Package, color: "bg-green-500" },
  { value: "ads", label: "Ads Manager", icon: Megaphone, color: "bg-purple-500" },
  { value: "moderator", label: "Moderator", icon: Shield, color: "bg-yellow-500" },
  { value: "admin", label: "Admin", icon: Crown, color: "bg-red-500" },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [users, setUsers] = useState<User[]>([])
  const [scripts, setScripts] = useState<Script[]>([])
  const [giveaways, setGiveaways] = useState<Giveaway[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingRoles, setEditingRoles] = useState<string[]>([])
  const [showAdDialog, setShowAdDialog] = useState(false)
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    category: "",
    status: "active",
    priority: 1,
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [activeScriptFilter, setActiveScriptFilter] = useState("all")
  const [rejectingScript, setRejectingScript] = useState<number | null>(null)
  const [viewingScript, setViewingScript] = useState<Script | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [activeGiveawayFilter, setActiveGiveawayFilter] = useState("all")
  const [rejectingGiveaway, setRejectingGiveaway] = useState<number | null>(null)
  const [giveawayRejectionReason, setGiveawayRejectionReason] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log("Loading admin data...")
      
      const [usersRes, scriptsRes, giveawaysRes, adsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/scripts"),
        fetch("/api/admin/giveaways"),
        fetch("/api/ads"),
      ])

      console.log("API responses:", {
        users: usersRes.status,
        scripts: scriptsRes.status,
        giveaways: giveawaysRes.status,
        ads: adsRes.status
      })

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        console.log("Users data:", usersData)
        setUsers(usersData.users || [])
      } else {
        console.error("Users API error:", usersRes.status, await usersRes.text())
      }

      if (scriptsRes.ok) {
        const scriptsData = await scriptsRes.json()
        console.log("Scripts data:", scriptsData)
        setScripts(scriptsData.scripts || [])
      } else {
        console.error("Scripts API error:", scriptsRes.status, await scriptsRes.text())
      }

      if (giveawaysRes.ok) {
        const giveawaysData = await giveawaysRes.json()
        setGiveaways(giveawaysData.giveaways || [])
      }

      if (adsRes.ok) {
        const adsData = await adsRes.json()
        setAds(adsData.ads || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setEditingRoles([...editingRoles, role])
    } else {
      setEditingRoles(editingRoles.filter(r => r !== role))
    }
  }

  const saveUserRoles = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/roles`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: editingRoles }),
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, roles: editingRoles }
            : user
        ))
        setSelectedUser(null)
        setEditingRoles([])
      }
    } catch (error) {
      console.error("Error updating user roles:", error)
    }
  }

  const createAd = async () => {
    try {
      let imageUrl = ""
      
      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData()
        formData.append("file", selectedImage)
        
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          imageUrl = uploadResult.url
        } else {
          console.error("Failed to upload image")
          return
        }
      }

      const adData = {
        ...newAd,
        image_url: imageUrl,
      }

      const response = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adData),
      })

      if (response.ok) {
        const result = await response.json()
        setAds([...ads, { ...adData, id: result.adId, created_at: new Date().toISOString() }])
        setNewAd({
          title: "",
          description: "",
          image_url: "",
          link_url: "",
          category: "",
          status: "active",
          priority: 1,
        })
        setSelectedImage(null)
        setShowAdDialog(false)
      }
    } catch (error) {
      console.error("Error creating ad:", error)
    }
  }

  const deleteAd = async (adId: number) => {
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAds(ads.filter(ad => ad.id !== adId))
      }
    } catch (error) {
      console.error("Error deleting ad:", error)
    }
  }

  const stats = {
    totalUsers: users.length,
    totalScripts: scripts.length,
    totalGiveaways: giveaways.length,
    totalAds: ads.length,
    pendingScripts: scripts.filter(s => s.status === "pending").length,
    activeAds: ads.filter(a => a.status === "active").length,
  }

  // Filter scripts based on active filter
  const filteredScripts = scripts.filter(script => {
    if (activeScriptFilter === "all") return true
    return script.status === activeScriptFilter
  })

  // Filter giveaways based on active filter
  const filteredGiveaways = giveaways.filter(giveaway => {
    if (activeGiveawayFilter === "all") return true
    return giveaway.status === activeGiveawayFilter
  })

  // Handle script approval/rejection
  const handleScriptAction = async (scriptId: number, status: "approved" | "rejected") => {
    try {
      const updateData: any = { status }
      
      if (status === "rejected" && rejectionReason) {
        updateData.reason = rejectionReason
      }
      
      const response = await fetch("/api/admin/scripts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptId, ...updateData }),
      })

      if (response.ok) {
        // Update local state
        setScripts(scripts.map(script => 
          script.id === scriptId 
            ? { ...script, status, rejection_reason: status === "rejected" ? rejectionReason : undefined }
            : script
        ))
        
        if (status === "rejected") {
          setRejectingScript(null)
          setRejectionReason("")
        }
        
        // Reload data to get updated information
        loadData()
        
        // If script was approved, show success message and redirect to scripts page
        if (status === "approved") {
          alert("Script approved successfully! Redirecting to scripts page...")
          window.location.href = "/scripts"
        }
      }
    } catch (error) {
      console.error("Error updating script:", error)
    }
  }

  // Handle giveaway approval/rejection
  const handleGiveawayAction = async (giveawayId: number, status: "approved" | "rejected") => {
    try {
      const updateData: any = { status }
      
      if (status === "rejected" && giveawayRejectionReason) {
        updateData.reason = giveawayRejectionReason
      }
      
      const response = await fetch("/api/admin/giveaways", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giveawayId, ...updateData }),
      })

      if (response.ok) {
        // Update local state
        setGiveaways(giveaways.map(giveaway => 
          giveaway.id === giveawayId 
            ? { ...giveaway, status, rejection_reason: status === "rejected" ? giveawayRejectionReason : undefined }
            : giveaway
        ))
        
        if (status === "rejected") {
          setRejectingGiveaway(null)
          setGiveawayRejectionReason("")
        }
        
        // Reload data to get updated information
        loadData()
        
        // If giveaway was approved, show success message and redirect to giveaways page
        if (status === "approved") {
          alert("Giveaway approved successfully! Redirecting to giveaways page...")
          window.location.href = "/giveaways"
        }
      }
    } catch (error) {
      console.error("Error updating giveaway:", error)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-gray-400">Manage users, scripts, giveaways, and advertisements</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-400">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-400">Total Scripts</p>
                    <p className="text-2xl font-bold text-white">{stats.totalScripts}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-400">Total Giveaways</p>
                    <p className="text-2xl font-bold text-white">{stats.totalGiveaways}</p>
                  </div>
                  <Gift className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-400">Active Ads</p>
                    <p className="text-2xl font-bold text-white">{stats.activeAds}</p>
                  </div>
                  <Megaphone className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800/30 border border-gray-700/50">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Users
              </TabsTrigger>
              <TabsTrigger value="scripts" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Scripts
              </TabsTrigger>
              <TabsTrigger value="giveaways" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Giveaways
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Content
              </TabsTrigger>
              <TabsTrigger value="ads" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Ads
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <Card className="bg-gray-800/30 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scripts.slice(0, 5).map((script) => (
                        <div key={script.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
                          <Package className="h-5 w-5 text-green-400" />
                          <div className="flex-1">
                            <p className="text-white font-medium">{script.title}</p>
                            <p className="text-sm text-gray-400">by {script.seller_name}</p>
                          </div>
                          <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                            {script.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card className="bg-gray-800/30 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="h-5 w-5 text-orange-500" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                        <span className="text-gray-300">Pending Scripts</span>
                        <Badge className="bg-yellow-500 text-white">{stats.pendingScripts}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                        <span className="text-gray-300">Active Ads</span>
                        <Badge className="bg-green-500 text-white">{stats.activeAds}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                        <span className="text-gray-300">Total Giveaways</span>
                        <Badge className="bg-purple-500 text-white">{stats.totalGiveaways}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card className="bg-gray-800/30 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    User Management
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage user roles and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 flex items-center justify-center">
                            <span className="text-black font-bold">{user.name?.[0] || "U"}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name || "Unknown"}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {user.roles.map((role) => {
                              const roleOption = roleOptions.find(r => r.value === role)
                              return roleOption ? (
                                <Badge key={role} className={`${roleOption.color} text-white`}>
                                  {roleOption.label}
                                </Badge>
                              ) : null
                            })}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setEditingRoles([...user.roles])
                            }}
                            className="border-gray-600 text-gray-300 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scripts" className="mt-6">
              <Card className="bg-gray-800/30 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-500" />
                    Script Management
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Review and manage pending scripts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant={activeScriptFilter === "all" ? "default" : "outline"}
                        onClick={() => setActiveScriptFilter("all")}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        All ({scripts.length})
                      </Button>
                      <Button
                        variant={activeScriptFilter === "pending" ? "default" : "outline"}
                        onClick={() => setActiveScriptFilter("pending")}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        Pending ({scripts.filter(s => s.status === "pending").length})
                      </Button>
                      <Button
                        variant={activeScriptFilter === "approved" ? "default" : "outline"}
                        onClick={() => setActiveScriptFilter("approved")}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Approved ({scripts.filter(s => s.status === "approved").length})
                      </Button>
                      <Button
                        variant={activeScriptFilter === "rejected" ? "default" : "outline"}
                        onClick={() => setActiveScriptFilter("rejected")}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Rejected ({scripts.filter(s => s.status === "rejected").length})
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredScripts.map((script) => (
                      <div key={script.id} className="border border-gray-700/50 rounded-lg p-4 bg-gray-700/20">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">{script.title}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Seller:</span>
                                <p className="text-white">{script.seller_name}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Category:</span>
                                <p className="text-white">{script.category}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Price:</span>
                                <p className="text-white">${script.price}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Framework:</span>
                                <p className="text-white">{script.framework || "N/A"}</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <span className="text-gray-400">Description:</span>
                              <p className="text-white text-sm mt-1 line-clamp-2">{script.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              className={
                                script.status === "pending" ? "bg-yellow-500 text-white" :
                                script.status === "approved" ? "bg-green-500 text-white" :
                                "bg-red-500 text-white"
                              }
                            >
                              {script.status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(script.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {script.status === "pending" && (
                          <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                            <Button
                              onClick={() => handleScriptAction(script.id, "approved")}
                              className="bg-green-500 hover:bg-green-600"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => setRejectingScript(script.id)}
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:text-red-300"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              onClick={() => setViewingScript(script)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:text-white"
                            >
                              View Details
                            </Button>
                          </div>
                        )}
                        
                        {script.status === "rejected" && script.rejection_reason && (
                          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                            <span className="text-red-400 text-sm font-medium">Rejection Reason:</span>
                            <p className="text-red-300 text-sm mt-1">{script.rejection_reason}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {filteredScripts.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No scripts found with the selected filter.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="giveaways" className="mt-6">
              <Card className="bg-gray-800/30 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-500" />
                    Giveaway Management
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Review and manage pending giveaways
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant={activeGiveawayFilter === "all" ? "default" : "outline"}
                        onClick={() => setActiveGiveawayFilter("all")}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        All ({giveaways.length})
                      </Button>
                      <Button
                        variant={activeGiveawayFilter === "pending" ? "default" : "outline"}
                        onClick={() => setActiveGiveawayFilter("pending")}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        Pending ({giveaways.filter(g => g.status === "pending").length})
                      </Button>
                      <Button
                        variant={activeGiveawayFilter === "approved" ? "default" : "outline"}
                        onClick={() => setActiveGiveawayFilter("approved")}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Approved ({giveaways.filter(g => g.status === "approved").length})
                      </Button>
                      <Button
                        variant={activeGiveawayFilter === "rejected" ? "default" : "outline"}
                        onClick={() => setActiveGiveawayFilter("rejected")}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Rejected ({giveaways.filter(g => g.status === "rejected").length})
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredGiveaways.map((giveaway) => (
                      <div key={giveaway.id} className="border border-gray-700/50 rounded-lg p-4 bg-gray-700/20">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">{giveaway.title}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Creator:</span>
                                <p className="text-white">{giveaway.creator_name}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Category:</span>
                                <p className="text-white">{giveaway.category}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Total Value:</span>
                                <p className="text-white">${giveaway.total_value}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Difficulty:</span>
                                <p className="text-white">{giveaway.difficulty || "N/A"}</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <span className="text-gray-400">Description:</span>
                              <p className="text-white text-sm mt-1 line-clamp-2">{giveaway.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              className={
                                giveaway.status === "pending" ? "bg-yellow-500 text-white" :
                                giveaway.status === "approved" ? "bg-green-500 text-white" :
                                "bg-red-500 text-white"
                              }
                            >
                              {giveaway.status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(giveaway.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {giveaway.status === "pending" && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => handleGiveawayAction(giveaway.id, "approved")}
                              className="bg-green-500 hover:bg-green-600"
                              size="sm"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => setRejectingGiveaway(giveaway.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {filteredGiveaways.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No giveaways found with the selected filter.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Scripts */}
                <Card className="bg-gray-800/30 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-500" />
                      Scripts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scripts.slice(0, 5).map((script) => (
                        <div key={script.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                          <div>
                            <p className="text-white font-medium">{script.title}</p>
                            <p className="text-sm text-gray-400">by {script.seller_name}</p>
                          </div>
                          <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                            {script.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Giveaways */}
                <Card className="bg-gray-800/30 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Gift className="h-5 w-5 text-purple-500" />
                      Giveaways
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {giveaways.slice(0, 5).map((giveaway) => (
                        <div key={giveaway.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                          <div>
                            <p className="text-white font-medium">{giveaway.title}</p>
                            <p className="text-sm text-gray-400">by {giveaway.creator_name}</p>
                          </div>
                          <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                            {giveaway.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ads" className="mt-6">
              <Card className="bg-gray-800/30 border-gray-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Megaphone className="h-5 w-5 text-orange-500" />
                        Advertisement Management
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Create and manage advertisements
                      </CardDescription>
                    </div>
                    <Dialog open={showAdDialog} onOpenChange={setShowAdDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Ad
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Create New Advertisement</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Add a new advertisement to the platform
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-300">Title</label>
                            <Input
                              value={newAd.title}
                              onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-300">Description</label>
                            <Textarea
                              value={newAd.description}
                              onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-300 mb-2 block">Advertisement Image</label>
                            <FileUpload
                              onFileSelect={setSelectedImage}
                              onFileRemove={() => setSelectedImage(null)}
                              selectedFile={selectedImage}
                              accept="image/*"
                              maxSize={5}
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-300">Link URL</label>
                            <Input
                              value={newAd.link_url}
                              onChange={(e) => setNewAd({ ...newAd, link_url: e.target.value })}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-300">Category</label>
                            <Select value={newAd.category} onValueChange={(value) => setNewAd({ ...newAd, category: value })}>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="scripts">Scripts</SelectItem>
                                <SelectItem value="giveaways">Giveaways</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm text-gray-300">Priority</label>
                            <Input
                              type="number"
                              value={newAd.priority}
                              onChange={(e) => setNewAd({ ...newAd, priority: parseInt(e.target.value) })}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={createAd} className="bg-orange-500 hover:bg-orange-600">
                              Create Ad
                            </Button>
                            <Button variant="outline" onClick={() => setShowAdDialog(false)} className="border-gray-600 text-gray-300">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ads.map((ad) => (
                      <div key={ad.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-400/20 flex items-center justify-center">
                            <Megaphone className="h-6 w-6 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{ad.title}</p>
                            <p className="text-sm text-gray-400">{ad.description}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                                {ad.category}
                              </Badge>
                              <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                                Priority: {ad.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={ad.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                            {ad.status}
                          </Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:text-red-300">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-800 border-gray-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete Advertisement</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                  Are you sure you want to delete this advertisement? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-600 text-gray-300">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteAd(ad.id)} className="bg-red-500 hover:bg-red-600">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Role Management Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Manage User Roles</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select roles for {selectedUser?.name || "this user"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {roleOptions.map((role) => (
              <div key={role.value} className="flex items-center space-x-3">
                <Checkbox
                  id={role.value}
                  checked={editingRoles.includes(role.value)}
                  onCheckedChange={(checked) => handleRoleChange(role.value, checked as boolean)}
                />
                <label htmlFor={role.value} className="flex items-center gap-2 text-white cursor-pointer">
                  <div className={`w-4 h-4 rounded ${role.color}`}></div>
                  <role.icon className="h-4 w-4" />
                  {role.label}
                </label>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <Button onClick={saveUserRoles} className="bg-orange-500 hover:bg-orange-600">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setSelectedUser(null)} className="border-gray-600 text-gray-300">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Script Rejection Dialog */}
      <Dialog open={!!rejectingScript} onOpenChange={() => setRejectingScript(null)}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Script</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please provide a reason for rejecting this script
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Rejection Reason</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleScriptAction(rejectingScript!, "rejected")}
                className="bg-red-500 hover:bg-red-600"
                disabled={!rejectionReason.trim()}
              >
                Reject Script
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setRejectingScript(null)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Script Details Dialog */}
      <Dialog open={!!viewingScript} onOpenChange={() => setViewingScript(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">Script Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed information about the script
            </DialogDescription>
          </DialogHeader>
          {viewingScript && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Title:</span>
                      <p className="text-white">{viewingScript.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Description:</span>
                      <p className="text-white text-sm">{viewingScript.description}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Category:</span>
                      <p className="text-white">{viewingScript.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Framework:</span>
                      <p className="text-white">{viewingScript.framework || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Seller Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Seller Name:</span>
                      <p className="text-white">{viewingScript.seller_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Price:</span>
                      <p className="text-white">${viewingScript.price}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Status:</span>
                      <Badge 
                        className={
                          viewingScript.status === "pending" ? "bg-yellow-500 text-white" :
                          viewingScript.status === "approved" ? "bg-green-500 text-white" :
                          "bg-red-500 text-white"
                        }
                      >
                        {viewingScript.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Created:</span>
                      <p className="text-white">{new Date(viewingScript.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {viewingScript.status === "pending" && (
                <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                  <Button
                    onClick={() => {
                      handleScriptAction(viewingScript.id, "approved")
                      setViewingScript(null)
                    }}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Script
                  </Button>
                  <Button
                    onClick={() => {
                      setViewingScript(null)
                      setRejectingScript(viewingScript.id)
                    }}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:text-red-300"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Script
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  )
}



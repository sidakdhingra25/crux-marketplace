"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  Gift,
  Clock,
  Users,
  Trophy,
  CheckCircle,
  Calendar,
  Share2,
  Heart,
  Flag,
  ThumbsUp,
  MessageCircle,
  Award,
  Sparkles,
  Zap,
  Target,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Animated background particles
const AnimatedParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-500/20 rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 12,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}

// Image Gallery Component for Giveaway
const GiveawayGallery = ({ images, videos }: { images: string[]; videos: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const allMedia = [...images, ...videos]
  const currentMedia = allMedia[currentIndex]
  const isVideo = videos.includes(currentMedia)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <motion.div
        className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden group"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
            {isVideo ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={currentMedia}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <motion.button
                    onClick={togglePlay}
                    className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </motion.button>
                  <motion.button
                    onClick={toggleMute}
                    className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </motion.button>
                </div>
              </div>
            ) : (
              <img
                src={currentMedia || "/cat.jpg"}
                alt="Giveaway preview"
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <motion.button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </>
        )}

        {/* Media Counter */}
        <motion.div
          className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {currentIndex + 1}/{allMedia.length}
        </motion.div>
      </motion.div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allMedia.map((media, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex ? "border-yellow-500 scale-105" : "border-gray-700 hover:border-gray-500"
              }`}
              whileHover={{ scale: index === currentIndex ? 1.05 : 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {videos.includes(media) ? (
                <div className="relative w-full h-full">
                  <video src={media} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={media || "/cat.jpg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function GiveawayDetailPage() {
  const params = useParams()
  const giveawayId = params.id as string

  const heroRef = useRef(null)
  const detailsRef = useRef(null)
  const commentsRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const detailsInView = useInView(detailsRef, { once: true })
  const commentsInView = useInView(commentsRef, { once: true })

  const [isEntered, setIsEntered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<number[]>([])
  const [newComment, setNewComment] = useState("")

  // Mock giveaway data
  const giveaway = {
    id: giveawayId,
    title: "Ultimate FiveM Script Bundle Giveaway",
    description:
      "Win the most comprehensive collection of premium FiveM scripts worth over $500! This massive bundle includes banking systems, vehicle dealerships, job scripts, housing systems, and much more. Perfect for server owners looking to create the ultimate roleplay experience.",
    value: "$500",
    entries: 2847,
    maxEntries: 5000,
    timeLeft: "3d 14h 32m",
    endDate: "2024-01-20T23:59:59",
    difficulty: "Medium",
    category: "Script Bundle",
    featured: true,
    creator: {
      name: "FiveHub Official",
        avatar: "/cat.jpg",
      verified: true,
      giveaways: 15,
      followers: 12500,
    },
    prizes: [
      {
        position: 1,
        name: "Complete Script Bundle",
        description: "All 25+ premium scripts including banking, vehicles, jobs, housing, and more",
        value: "$500",
        winner: null,
      },
      {
        position: 2,
        name: "Economy Pack",
        description: "Banking system, ATM network, and business management scripts",
        value: "$150",
        winner: null,
      },
      {
        position: 3,
        name: "Vehicle Bundle",
        description: "Car dealership, garage system, and vehicle management scripts",
        value: "$100",
        winner: null,
      },
    ],
    requirements: [
      {
        id: 1,
        type: "discord",
        description: "Join our Discord server",
        points: 1,
        required: true,
        completed: false,
        link: "https://discord.gg/fivehub",
      },
      {
        id: 2,
        type: "follow",
        description: "Follow us on Twitter",
        points: 1,
        required: false,
        completed: false,
        link: "https://twitter.com/fivehub",
      },
      {
        id: 3,
        type: "share",
        description: "Share this giveaway on social media",
        points: 2,
        required: false,
        completed: false,
      },
      {
        id: 4,
        type: "tag",
        description: "Tag 3 friends in the comments",
        points: 2,
        required: false,
        completed: false,
      },
      {
        id: 5,
        type: "subscribe",
        description: "Subscribe to our newsletter",
        points: 1,
        required: false,
        completed: false,
      },
    ],
    images: [
      "/cat.jpg",
      "/cat.jpg",
      "/cat.jpg",
      "/cat.jpg",
    ],
    videos: ["/placeholder.mp4"],
    tags: ["Scripts", "Bundle", "Premium", "FiveM", "Roleplay"],
    rules: [
      "Must be 18+ or have parental consent",
      "One entry per person",
      "Complete all required tasks to qualify",
      "Winners will be contacted via Discord",
      "Prizes must be claimed within 48 hours",
    ],
    stats: {
      totalEntries: 2847,
      uniqueParticipants: 2156,
      completionRate: 76,
      shareCount: 1234,
    },
  }

  const comments = [
    {
      id: 1,
      author: "ServerOwner123",
      avatar: "/cat.jpg",
      content: "This is an amazing giveaway! Really hope I win, my server could use these scripts! 🤞",
      timestamp: "2 hours ago",
      likes: 23,
      replies: 3,
      verified: true,
    },
    {
      id: 2,
      author: "RPMaster",
      avatar: "/cat.jpg",
      content: "Just completed all the tasks! Good luck everyone! @friend1 @friend2 @friend3",
      timestamp: "4 hours ago",
      likes: 15,
      replies: 1,
      verified: false,
    },
    {
      id: 3,
      author: "DevCommunity",
      avatar: "/cat.jpg",
      content: "These scripts look incredible! The banking system alone is worth entering for.",
      timestamp: "6 hours ago",
      likes: 31,
      replies: 5,
      verified: true,
    },
  ]

  const relatedGiveaways = [
    {
      id: 2,
      title: "Custom Development Service",
      value: "$300",
      timeLeft: "5d 8h",
      image: "/cat.jpg",
      entries: 892,
    },
    {
      id: 3,
      title: "Server Setup Package",
      value: "$200",
      timeLeft: "1d 3h",
      image: "/cat.jpg",
      entries: 634,
    },
    {
      id: 4,
      title: "Premium Script Collection",
      value: "$150",
      timeLeft: "7d 12h",
      image: "/cat.jpg",
      entries: 1456,
    },
  ]

  const handleTaskComplete = (taskId: number) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId])
    }
  }

  const handleEnterGiveaway = () => {
    const requiredTasks = giveaway.requirements.filter((req) => req.required)
    const completedRequired = requiredTasks.every((task) => completedTasks.includes(task.id))

    if (completedRequired) {
      setIsEntered(true)
    } else {
      alert("Please complete all required tasks first!")
    }
  }

  const totalPoints = giveaway.requirements.reduce((sum, req) => sum + req.points, 0)
  const earnedPoints = giveaway.requirements
    .filter((req) => completedTasks.includes(req.id))
    .reduce((sum, req) => sum + req.points, 0)

  const progressPercentage = (giveaway.entries / giveaway.maxEntries) * 100

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <AnimatedParticles />

        {/* Animated background */}
        <div className="fixed inset-0 -z-10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.03) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.03) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(234, 179, 8, 0.03) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.section
            ref={heroRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Image Gallery */}
            <div>
              <GiveawayGallery images={giveaway.images} videos={giveaway.videos} />
            </div>

            {/* Giveaway Info */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{giveaway.category}</Badge>
                  <Badge
                    className={`${
                      giveaway.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : giveaway.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {giveaway.difficulty}
                  </Badge>
                  {giveaway.featured && <Badge className="bg-orange-500 text-white">Featured</Badge>}
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">{giveaway.title}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="text-3xl font-bold text-yellow-400"
                    animate={{
                      textShadow: ["0 0 0px currentColor", "0 0 20px currentColor", "0 0 0px currentColor"],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {giveaway.value}
                  </motion.div>
                  <div className="text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold text-orange-500">{giveaway.timeLeft}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4" />
                      <span>{giveaway.entries.toLocaleString()} entries</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">{giveaway.description}</p>

                {/* Creator Info */}
                <motion.div
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 mb-6 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={giveaway.creator.avatar || "/cat.jpg"} />
                      <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                        {giveaway.creator.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{giveaway.creator.name}</h3>
                        {giveaway.creator.verified && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
                            <Award className="h-4 w-4 text-yellow-400" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{giveaway.creator.giveaways} giveaways</span>
                        <span>{giveaway.creator.followers.toLocaleString()} followers</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                      Follow
                    </Button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Entry Progress */}
              <motion.div
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Entry Progress</h3>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {earnedPoints}/{totalPoints} points
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{giveaway.entries.toLocaleString()} entries</span>
                    <span>{giveaway.maxEntries.toLocaleString()} max</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-gray-700" />
                </div>

                <div className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleEnterGiveaway}
                      disabled={isEntered}
                      className={`w-full ${
                        isEntered
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                      } text-black font-bold py-3 text-lg shadow-lg`}
                    >
                      {isEntered ? (
                        <>
                          <Trophy className="mr-2 h-5 w-5" />
                          Entered!
                        </>
                      ) : (
                        <>
                          <Gift className="mr-2 h-5 w-5" />
                          Enter Giveaway
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-yellow-500"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                      >
                        <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                        {isWishlisted ? "Saved" : "Save"}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-yellow-500"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Sparkles className="h-4 w-4" />
                      <span>{giveaway.stats.uniqueParticipants.toLocaleString()} participants</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Target className="h-4 w-4" />
                      <span>{giveaway.stats.completionRate}% completion rate</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Share2 className="h-4 w-4" />
                      <span>{giveaway.stats.shareCount.toLocaleString()} shares</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Ends {new Date(giveaway.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Detailed Information Tabs */}
          <motion.section
            ref={detailsRef}
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={detailsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm">
                <TabsTrigger value="tasks" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="prizes"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                >
                  Prizes
                </TabsTrigger>
                <TabsTrigger value="rules" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  Rules
                </TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  Stats
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="mt-6">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="h-5 w-5 text-yellow-400" />
                      Entry Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {giveaway.requirements.map((task, index) => (
                      <motion.div
                        key={task.id}
                        className={`p-4 rounded-lg border transition-all duration-300 ${
                          completedTasks.includes(task.id)
                            ? "bg-green-500/10 border-green-500/30"
                            : "bg-gray-700/30 border-gray-600/50 hover:border-yellow-500/50"
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                completedTasks.includes(task.id) ? "bg-green-500 border-green-500" : "border-gray-500"
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {completedTasks.includes(task.id) && <CheckCircle className="h-4 w-4 text-white" />}
                            </motion.div>
                            <div>
                              <h4 className="text-white font-medium flex items-center gap-2">
                                {task.description}
                                {task.required && (
                                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                                    Required
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {task.type === "discord" && "Join our community server"}
                                {task.type === "follow" && "Follow us for updates"}
                                {task.type === "share" && "Help spread the word"}
                                {task.type === "tag" && "Tag friends to increase your chances"}
                                {task.type === "subscribe" && "Get notified about new giveaways"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              +{task.points} pts
                            </Badge>
                            {!completedTasks.includes(task.id) && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  onClick={() => handleTaskComplete(task.id)}
                                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                                >
                                  {task.link ? (
                                    <>
                                      <ExternalLink className="mr-1 h-3 w-3" />
                                      Complete
                                    </>
                                  ) : (
                                    "Mark Done"
                                  )}
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prizes" className="mt-6">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      Prize Pool
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {giveaway.prizes.map((prize, index) => (
                      <motion.div
                        key={prize.position}
                        className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">
                              {prize.position === 1 ? "🥇" : prize.position === 2 ? "🥈" : "🥉"}
                            </div>
                            <div>
                              <h3 className="text-white font-bold text-lg">{prize.name}</h3>
                              <p className="text-gray-400">{prize.description}</p>
                            </div>
                          </div>
                          <motion.div
                            className="text-2xl font-bold text-yellow-400"
                            animate={{
                              textShadow: ["0 0 0px currentColor", "0 0 15px currentColor", "0 0 0px currentColor"],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                          >
                            {prize.value}
                          </motion.div>
                        </div>
                        {prize.winner ? (
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span>Won by {prize.winner}</span>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">Winner will be announced soon</div>
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules" className="mt-6">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Flag className="h-5 w-5 text-yellow-400" />
                      Giveaway Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {giveaway.rules.map((rule, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gray-700/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-yellow-400 text-sm font-bold">{index + 1}</span>
                          </div>
                          <span className="text-gray-300">{rule}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="mt-6">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      Giveaway Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">Participation</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Entries:</span>
                              <span className="text-white font-semibold">
                                {giveaway.stats.totalEntries.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Unique Participants:</span>
                              <span className="text-white font-semibold">
                                {giveaway.stats.uniqueParticipants.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Completion Rate:</span>
                              <span className="text-white font-semibold">{giveaway.stats.completionRate}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">Engagement</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Shares:</span>
                              <span className="text-white font-semibold">
                                {giveaway.stats.shareCount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Comments:</span>
                              <span className="text-white font-semibold">{comments.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Time Remaining:</span>
                              <span className="text-orange-500 font-semibold">{giveaway.timeLeft}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.section>

          {/* Comments Section */}
          <motion.section
            ref={commentsRef}
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={commentsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-yellow-400" />
                    Comments ({comments.length})
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <Textarea
                    placeholder="Share your thoughts or tag friends..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 mb-4"
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">Tag 3 friends to earn extra points!</p>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Post Comment</Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      className="bg-gray-700/30 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.avatar || "/cat.jpg"} />
                          <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                            {comment.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-white font-semibold">{comment.author}</h4>
                            {comment.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                            <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-300 mb-3">{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <motion.button
                              className="flex items-center gap-1 text-gray-400 hover:text-yellow-400 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span className="text-sm">{comment.likes}</span>
                            </motion.button>
                            <motion.button
                              className="flex items-center gap-1 text-gray-400 hover:text-yellow-400 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-sm">Reply ({comment.replies})</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Related Giveaways */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              More Giveaways
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedGiveaways.map((giveaway, index) => (
                <motion.div
                  key={giveaway.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/giveaway/${giveaway.id}`}>
                    <Card className="bg-gray-800/30 border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                      <CardHeader className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={giveaway.image || "/cat.jpg"}
                            alt={giveaway.title}
                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                          />
                          <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-bold">
                            {giveaway.value}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="text-white font-semibold mb-2 hover:text-yellow-400 transition-colors">
                          {giveaway.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-orange-500">
                            <Clock className="h-4 w-4" />
                            <span>{giveaway.timeLeft}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Users className="h-4 w-4" />
                            <span>{giveaway.entries}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
      <Footer />
    </>
  )
}

"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Download,
  Shield,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ThumbsUp,
  MessageCircle,
  Flag,
  Award,
  Zap,
  Sparkles,
  Calendar,
  Package,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
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
          className="absolute w-1 h-1 bg-orange-500/20 rounded-full"
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
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}

// Image Gallery Component
const ImageGallery = ({ images, videos }: { images: string[]; videos: string[] }) => {
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
            transition={{ duration: 1 }}
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
                alt="Script preview"
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
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

        {/* Media Type Badge */}
        <motion.div
          className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isVideo ? "Video" : "Image"} {currentIndex + 1}/{allMedia.length}
        </motion.div>
      </motion.div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {allMedia.map((media, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              index === currentIndex ? "border-orange-500 scale-105" : "border-gray-700 hover:border-gray-500"
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
    </div>
  )
}

// Review Component
const ReviewCard = ({ review, index }: { review: any; index: number }) => {
  const [isHelpful, setIsHelpful] = useState(false)
  const [isReported, setIsReported] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.avatar || "/cat.jpg"} />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold">
                {review.author[0]}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <h4 className="text-white font-semibold flex items-center gap-2">
              {review.author}
              {review.verified && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 + 0.2 }}>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </motion.div>
              )}
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                  >
                    <Star
                      className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm text-gray-400">{review.date}</span>
            </div>
          </div>
        </div>
        <motion.button
          onClick={() => setIsReported(!isReported)}
          className={`p-2 rounded-full transition-colors ${
            isReported ? "bg-red-500/20 text-red-400" : "hover:bg-gray-700/50 text-gray-400"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Flag className="h-4 w-4" />
        </motion.button>
      </div>

      <p className="text-gray-300 mb-4 leading-relaxed">{review.content}</p>

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.images.map((image: string, imgIndex: number) => (
            <motion.img
              key={imgIndex}
              src={image}
              alt={`Review image ${imgIndex + 1}`}
              className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + imgIndex * 0.05 }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setIsHelpful(!isHelpful)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
              isHelpful
                ? "bg-green-500/20 text-green-400"
                : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThumbsUp className="h-4 w-4" />
            Helpful ({review.helpful})
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="h-4 w-4" />
            Reply
          </motion.button>
        </div>
        {review.purchaseVerified && (
          <motion.div
            className="flex items-center gap-1 text-xs text-green-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <CheckCircle className="h-3 w-3" />
            Verified Purchase
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function ScriptDetailPage() {
  const params = useParams()
  const scriptId = params.id as string

  const heroRef = useRef(null)
  const detailsRef = useRef(null)
  const reviewsRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const detailsInView = useInView(detailsRef, { once: true })
  const reviewsInView = useInView(reviewsRef, { once: true })

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(0)

  // Mock script data
  const script = {
    id: scriptId,
    title: "Advanced Banking System Pro",
    description:
      "The most comprehensive banking solution for FiveM servers. Features include multi-bank support, ATM networks, loan systems, credit cards, investment portfolios, and complete admin management.",
    price: 45.99,
    originalPrice: 65.99,
    discount: 30,
    rating: 4.8,
    reviews: 247,
    downloads: 1542,
    lastUpdated: "2024-01-15",
    version: "2.1.4",
    category: "Economy",
    framework: "QBCore",
    seller: {
      name: "ScriptMaster",
      avatar: "/cat.jpg",
      rating: 4.9,
      scripts: 23,
      joined: "2022-03-15",
      verified: true,
    },
    features: [
      "Multi-bank support with custom bank creation",
      "Advanced ATM network with withdrawal limits",
      "Comprehensive loan system with interest rates",
      "Credit card system with spending limits",
      "Investment portfolios and stock trading",
      "Transaction history and statements",
      "Admin panel with full control",
      "Anti-cheat protection built-in",
      "Mobile banking app integration",
      "Cryptocurrency support",
    ],
    requirements: ["QBCore Framework", "MySQL Database", "FiveM Server Build 2545+", "Basic Lua knowledge for setup"],
    changelog: [
      {
        version: "2.1.4",
        date: "2024-01-15",
        changes: ["Fixed ATM withdrawal bug", "Added new bank locations", "Improved performance"],
      },
      {
        version: "2.1.3",
        date: "2024-01-10",
        changes: ["Added cryptocurrency support", "New admin commands", "UI improvements"],
      },
      {
        version: "2.1.2",
        date: "2024-01-05",
        changes: ["Security patches", "Database optimization", "Bug fixes"],
      },
    ],
    images: [
        "/cat.jpg",
      "/cat.jpg",
    ],
    videos: ["/placeholder.mp4", "/placeholder.mp4"],
    tags: ["Banking", "Economy", "ATM", "Loans", "QBCore", "Admin", "Security"],
    support: {
      documentation: true,
      discord: true,
      updates: "Lifetime",
      installation: "Included",
    },
  }

  const reviews = [
    {
      id: 1,
      author: "ServerOwner123",
      avatar: "/cat.jpg",
      rating: 5,
      date: "2024-01-10",
      content:
        "Absolutely amazing script! The banking system is incredibly detailed and our players love it. The admin panel makes management so easy. Worth every penny!",
      helpful: 23,
      verified: true,
      purchaseVerified: true,
      images: ["/cat.jpg", "/cat.jpg"],
    },
    {
      id: 2,
      author: "RPMaster",
      avatar: "/cat.jpg",
      rating: 4,
      date: "2024-01-08",
      content:
        "Great script with lots of features. Setup was straightforward with the documentation. Only minor issue was with the ATM locations but support helped quickly.",
      helpful: 15,
      verified: true,
      purchaseVerified: true,
    },
    {
      id: 3,
      author: "DevCommunity",
      avatar: "/cat.jpg",
      rating: 5,
      date: "2024-01-05",
      content:
        "This is exactly what we needed for our economy server. The loan system is perfect and the credit cards add so much immersion. Highly recommended!",
      helpful: 31,
      verified: true,
      purchaseVerified: true,
    },
  ]

  const relatedScripts = [
    {
      id: 2,
      title: "ATM Network Expansion",
      price: 15.99,
      rating: 4.6,
      image: "/cat.jpg",
    },
    {
      id: 3,
      title: "Economy Dashboard",
      price: 25.99,
      rating: 4.7,
      image: "/cat.jpg",
    },
    {
      id: 4,
      title: "Business Management",
      price: 35.99,
      rating: 4.5,
      image: "/cat.jpg",
    },
  ]

  const ratingDistribution = [
    { stars: 5, count: 156, percentage: 63 },
    { stars: 4, count: 67, percentage: 27 },
    { stars: 3, count: 18, percentage: 7 },
    { stars: 2, count: 4, percentage: 2 },
    { stars: 1, count: 2, percentage: 1 },
  ]

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
                "radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.03) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.03) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(249, 115, 22, 0.03) 0%, transparent 50%)",
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
              <ImageGallery images={script.images} videos={script.videos} />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">{script.category}</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{script.framework}</Badge>
                  {script.discount > 0 && <Badge className="bg-red-500 text-white">-{script.discount}% OFF</Badge>}
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">{script.title}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            i < Math.floor(script.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-white font-semibold">{script.rating}</span>
                  <span className="text-gray-400">({script.reviews} reviews)</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{script.downloads} downloads</span>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">{script.description}</p>

                {/* Seller Info */}
                <motion.div
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 mb-6 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                          <AvatarImage src={script.seller.avatar || "/cat.jpg"} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold">
                        {script.seller.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{script.seller.name}</h3>
                        {script.seller.verified && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
                            <Award className="h-4 w-4 text-yellow-400" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{script.seller.rating}★ rating</span>
                        <span>{script.seller.scripts} scripts</span>
                        <span>Joined {script.seller.joined}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                      View Profile
                    </Button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Pricing and Actions */}
              <motion.div
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <motion.span
                      className="text-3xl font-bold text-orange-500"
                      animate={{
                        textShadow: ["0 0 0px currentColor", "0 0 20px currentColor", "0 0 0px currentColor"],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      ${script.price}
                    </motion.span>
                    {script.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">${script.originalPrice}</span>
                    )}
                  </div>
                  {script.discount > 0 && (
                    <motion.div
                      className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      Save ${(script.originalPrice! - script.price).toFixed(2)}
                    </motion.div>
                  )}
                </div>

                <div className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-bold py-3 text-lg shadow-lg">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-orange-500"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                      >
                        <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                        {isWishlisted ? "Wishlisted" : "Wishlist"}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-orange-500"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Download className="h-4 w-4" />
                      <span>Instant Download</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Shield className="h-4 w-4" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Lifetime Updates</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>24/7 Support</span>
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
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="requirements"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Requirements
                </TabsTrigger>
                <TabsTrigger
                  value="changelog"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Changelog
                </TabsTrigger>
                <TabsTrigger
                  value="support"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Support
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Info className="h-5 w-5 text-orange-500" />
                      Script Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                      <p className="text-gray-300 leading-relaxed">{script.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-semibold mb-3">Script Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Version:</span>
                            <span className="text-white">{script.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Last Updated:</span>
                            <span className="text-white">{script.lastUpdated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Downloads:</span>
                            <span className="text-white">{script.downloads.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Framework:</span>
                            <span className="text-white">{script.framework}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {script.tags.map((tag, index) => (
                            <motion.div
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Badge variant="secondary" className="bg-gray-700/50 text-gray-300">
                                {tag}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      Features & Capabilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {script.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="mt-6">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      System Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {script.requirements.map((requirement, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Package className="h-5 w-5 text-blue-500" />
                          <span className="text-gray-300">{requirement}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="changelog" className="mt-6">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      Version History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {script.changelog.map((version, index) => (
                        <motion.div
                          key={version.version}
                          className="border-l-2 border-orange-500/30 pl-6 relative"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="absolute -left-2 top-0 w-4 h-4 bg-orange-500 rounded-full"></div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-white font-semibold">Version {version.version}</h4>
                            <span className="text-sm text-gray-400">{version.date}</span>
                          </div>
                          <ul className="space-y-1">
                            {version.changes.map((change, changeIndex) => (
                              <li key={changeIndex} className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                {change}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="mt-6">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-orange-500" />
                      Support & Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <h4 className="text-white font-semibold">Documentation</h4>
                            <p className="text-sm text-gray-400">Complete setup and usage guide</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <h4 className="text-white font-semibold">Discord Support</h4>
                            <p className="text-sm text-gray-400">24/7 community support</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <h4 className="text-white font-semibold">Lifetime Updates</h4>
                            <p className="text-sm text-gray-400">Free updates for life</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <h4 className="text-white font-semibold">Installation Help</h4>
                            <p className="text-sm text-gray-400">Step-by-step installation</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Documentation
                      </Button>
                      <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Join Discord
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.section>

          {/* Reviews Section */}
          <motion.section
            ref={reviewsRef}
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      Customer Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <motion.div
                        className="text-4xl font-bold text-white mb-2"
                        animate={{
                          textShadow: [
                            "0 0 0px currentColor",
                            "0 0 20px rgba(234, 179, 8, 0.5)",
                            "0 0 0px currentColor",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {script.rating}
                      </motion.div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(script.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-400">Based on {script.reviews} reviews</p>
                    </div>

                    <div className="space-y-3">
                      {ratingDistribution.map((rating, index) => (
                        <motion.div
                          key={rating.stars}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="text-sm text-gray-400 w-8">{rating.stars}★</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-orange-500 to-yellow-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${rating.percentage}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-8">{rating.count}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Reviews ({script.reviews})</h3>
                  <Button className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-semibold">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Write Review
                  </Button>
                </div>

                {/* Write Review Form */}
                <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Write a Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Rating</label>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.button
                            key={i}
                            onClick={() => setNewRating(i + 1)}
                            className="p-1"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Star
                              className={`h-6 w-6 ${i < newRating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Review</label>
                      <Textarea
                        placeholder="Share your experience with this script..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                        rows={4}
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-semibold">
                      Submit Review
                    </Button>
                  </CardContent>
                </Card>

                {/* Reviews */}
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <ReviewCard key={review.id} review={review} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Related Scripts */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-orange-500" />
              Related Scripts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedScripts.map((relatedScript, index) => (
                <motion.div
                  key={relatedScript.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-gray-800/30 border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={relatedScript.image || "/cat.jpg"}
                          alt={relatedScript.title}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="text-white font-semibold mb-2 hover:text-orange-500 transition-colors">
                        {relatedScript.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-400">{relatedScript.rating}</span>
                        </div>
                        <span className="text-orange-500 font-bold">${relatedScript.price}</span>
                      </div>
                    </CardContent>
                  </Card>
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

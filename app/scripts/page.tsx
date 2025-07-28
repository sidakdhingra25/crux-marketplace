"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Search, Filter, Star, ShoppingCart, Grid, List, ChevronDown, X, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Animated background particles
const AnimatedParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-orange-500/30 rounded-full"
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 12,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
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

export default function ScriptsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filtersRef = useRef(null)
  const scriptsRef = useRef(null)

  const filtersInView = useInView(filtersRef, { once: true })
  const scriptsInView = useInView(scriptsRef, { once: true })

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [sortBy, setSortBy] = useState("popular")
  const categoryParam = searchParams.get("category") ?? ""

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => (categoryParam ? [categoryParam] : []))

  useEffect(() => {
    setSelectedCategories(categoryParam ? [categoryParam] : [])
  }, [categoryParam])

  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [selectedPriceCategories, setSelectedPriceCategories] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const allScripts = [
    {
      id: 1,
      title: "Advanced Banking System",
      description:
        "Complete banking solution with ATMs, loans, transfers, and multi-bank support. Features transaction history and admin panel.",
      price: 25.99,
      originalPrice: 35.99,
      rating: 4.8,
      reviews: 124,
      image: "/cat.jpg",
      category: "economy",
      categoryName: "Economy",
      seller: "ScriptMaster",
      discount: 28,
      framework: "QBCore",
      priceCategory: "Standard",
      tags: ["Banking", "Economy", "ATM", "Loans"],
      lastUpdated: "2024-01-08",
    },
    {
      id: 2,
      title: "Realistic Car Dealership",
      description:
        "Full featured car dealership with test drives, financing options, showroom management and sales tracking.",
      price: 19.99,
      rating: 4.9,
      reviews: 89,
      image: "/cat.jpg",
      category: "vehicles",
      categoryName: "Vehicles",
      seller: "AutoDev",
      discount: 0,
      framework: "ESX",
      priceCategory: "Standard",
      tags: ["Vehicles", "Dealership", "Finance"],
      lastUpdated: "2024-01-07",
    },
    {
      id: 3,
      title: "Police MDT System",
      description:
        "Mobile Data Terminal for law enforcement with warrant system, BOLO alerts, and comprehensive officer management.",
      price: 15.99,
      originalPrice: 22.99,
      rating: 4.7,
      reviews: 156,
      image: "/cat.jpg",
      category: "jobs",
      categoryName: "Jobs",
      seller: "LawEnforcer",
      discount: 30,
      framework: "QBCore",
      priceCategory: "Standard",
      tags: ["Police", "MDT", "Law Enforcement"],
      lastUpdated: "2024-01-06",
    },
    {
      id: 4,
      title: "Hospital Management Pro",
      description:
        "Complete medical system with patient records, billing, emergency services, and integrated pharmacy system.",
      price: 29.99,
      rating: 4.6,
      reviews: 67,
      image: "/cat.jpg",
      category: "medical",
      categoryName: "Medical",
      seller: "MedScript",
      discount: 0,
      framework: "Standalone",
      priceCategory: "Standard",
      tags: ["Medical", "Hospital", "Healthcare"],
      lastUpdated: "2024-01-05",
    },
    {
      id: 5,
      title: "Real Estate Empire",
      description:
        "Property buying, selling, and renting system with interior customization and comprehensive property management tools.",
      price: 22.99,
      originalPrice: 29.99,
      rating: 4.5,
      reviews: 93,
      image: "/cat.jpg",
      category: "housing",
      categoryName: "Housing",
      seller: "PropertyPro",
      discount: 23,
      framework: "QBCore",
      priceCategory: "Standard",
      tags: ["Housing", "Real Estate", "Property"],
      lastUpdated: "2024-01-04",
    },
    {
      id: 6,
      title: "Budget Inventory System",
      description: "Simple but effective inventory system with basic drag & drop functionality and item management.",
      price: 8.99,
      rating: 4.2,
      reviews: 201,
      image: "/cat.jpg",
      category: "core",
      categoryName: "Core",
      seller: "BudgetDev",
      discount: 0,
      framework: "ESX",
      priceCategory: "Budget",
      tags: ["Inventory", "Core", "Items"],
      lastUpdated: "2024-01-03",
    },
    {
      id: 7,
      title: "Premium Police Pack",
      description: "Complete police package with MDT, evidence system, jail management, and officer tools.",
      price: 45.99,
      originalPrice: 59.99,
      rating: 4.9,
      reviews: 78,
      image: "/cat.jpg",
      category: "police",
      categoryName: "Police",
      seller: "LawEnforcer",
      discount: 23,
      framework: "QBCore",
      priceCategory: "Premium",
      tags: ["Police", "MDT", "Evidence", "Jail"],
      lastUpdated: "2024-01-09",
    },
    {
      id: 8,
      title: "Server Admin Tools",
      description: "Comprehensive admin toolkit with player management, server monitoring, and moderation features.",
      price: 35.99,
      rating: 4.4,
      reviews: 156,
      image: "/cat.jpg",
      category: "utilities",
      categoryName: "Utilities",
      seller: "AdminPro",
      discount: 0,
      framework: "Standalone",
      priceCategory: "Premium",
      tags: ["Admin", "Tools", "Management"],
      lastUpdated: "2024-01-02",
    },
  ]

  const categories = [
    { id: "economy", name: "Economy" },
    { id: "vehicles", name: "Vehicles" },
    { id: "jobs", name: "Jobs" },
    { id: "housing", name: "Housing" },
    { id: "medical", name: "Medical" },
    { id: "police", name: "Police" },
    { id: "utilities", name: "Utilities" },
    { id: "core", name: "Core" },
  ]

  const frameworks = ["QBCore", "ESX", "Standalone", "vRP", "Custom"]
  const priceCategories = ["Budget", "Standard", "Premium"]

  // Real-time filtering logic
  const filteredScripts = useMemo(() => {
    return allScripts.filter((script) => {
      if (
        searchQuery &&
        !script.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !script.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !script.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(script.category)) {
        return false
      }

      if (selectedFrameworks.length > 0 && !selectedFrameworks.includes(script.framework)) {
        return false
      }

      if (selectedPriceCategories.length > 0 && !selectedPriceCategories.includes(script.priceCategory)) {
        return false
      }

      if (script.price < priceRange[0] || script.price > priceRange[1]) {
        return false
      }

      if (selectedRatings.length > 0 && !selectedRatings.some((rating) => script.rating >= rating)) {
        return false
      }

      if (onSaleOnly && script.discount === 0) {
        return false
      }

      return true
    })
  }, [
    allScripts,
    searchQuery,
    selectedCategories,
    selectedFrameworks,
    selectedPriceCategories,
    priceRange,
    selectedRatings,
    onSaleOnly,
  ])

  // Sorting logic
  const sortedScripts = useMemo(() => {
    const scripts = [...filteredScripts]
    switch (sortBy) {
      case "price-low":
        return scripts.sort((a, b) => a.price - b.price)
      case "price-high":
        return scripts.sort((a, b) => b.price - a.price)
      case "rating":
        return scripts.sort((a, b) => b.rating - a.rating)
      case "newest":
        return scripts.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      default:
        return scripts.sort((a, b) => b.reviews - a.reviews)
    }
  }, [filteredScripts, sortBy])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleFrameworkChange = (framework: string, checked: boolean) => {
    if (checked) {
      setSelectedFrameworks([...selectedFrameworks, framework])
    } else {
      setSelectedFrameworks(selectedFrameworks.filter((f) => f !== framework))
    }
  }

  const handlePriceCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedPriceCategories([...selectedPriceCategories, category])
    } else {
      setSelectedPriceCategories(selectedPriceCategories.filter((c) => c !== category))
    }
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRatings([...selectedRatings, rating])
    } else {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating))
    }
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedFrameworks([])
    setSelectedPriceCategories([])
    setSelectedRatings([])
    setPriceRange([0, 100])
    setOnSaleOnly(false)
    setSearchQuery("")
    router.push("/scripts")
  }

  const removeFilter = (type: string, value: string | number) => {
    switch (type) {
      case "category":
        handleCategoryChange(value as string, false)
        break
      case "framework":
        handleFrameworkChange(value as string, false)
        break
      case "priceCategory":
        handlePriceCategoryChange(value as string, false)
        break
      case "rating":
        handleRatingChange(value as number, false)
        break
    }
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedFrameworks.length +
    selectedPriceCategories.length +
    selectedRatings.length +
    (onSaleOnly ? 1 : 0)

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
                "radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* Header */}
        <motion.div
          className="bg-gray-900/30 backdrop-blur-xl py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800/50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.nav
              className="flex items-center space-x-2 text-sm text-gray-400 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/" className="hover:text-orange-500 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-white">All Scripts</span>
            </motion.nav>

            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                All Scripts
              </span>
            </motion.h1>

            <motion.p
              className="text-gray-400 mb-4 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Browse our complete collection of premium FiveM scripts
            </motion.p>

            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500" />
                {sortedScripts.length} scripts found
              </div>
              {activeFiltersCount > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">{activeFiltersCount} filters active</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.div
              ref={filtersRef}
              className="lg:w-80 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={filtersInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
                      <Filter className="mr-2 h-5 w-5" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }}>
                          <Badge className="ml-2 bg-orange-500 text-white">{activeFiltersCount}</Badge>
                        </motion.div>
                      )}
                    </motion.div>
                    {activeFiltersCount > 0 && (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="text-orange-500 hover:text-orange-400 p-0 h-auto"
                        >
                          Clear All
                        </Button>
                      </motion.div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
                      <span className="text-sm font-medium text-white group-hover:text-orange-500 transition-colors">
                        Categories
                      </span>
                      <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </motion.div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {categories.map((category, index) => (
                        <motion.div
                          key={category.id}
                          className="flex items-center space-x-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
                          >
                            {category.name}
                          </label>
                        </motion.div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Framework Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
                      <span className="text-sm font-medium text-white group-hover:text-orange-500 transition-colors">
                        Framework
                      </span>
                      <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </motion.div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {frameworks.map((framework, index) => (
                        <motion.div
                          key={framework}
                          className="flex items-center space-x-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <Checkbox
                            id={`framework-${framework}`}
                            checked={selectedFrameworks.includes(framework)}
                            onCheckedChange={(checked) => handleFrameworkChange(framework, checked as boolean)}
                          />
                          <label
                            htmlFor={`framework-${framework}`}
                            className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
                          >
                            {framework}
                          </label>
                        </motion.div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Price Categories */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
                      <span className="text-sm font-medium text-white group-hover:text-orange-500 transition-colors">
                        Price Range
                      </span>
                      <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </motion.div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {priceCategories.map((category, index) => (
                        <motion.div
                          key={category}
                          className="flex items-center space-x-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <Checkbox
                            id={`price-${category}`}
                            checked={selectedPriceCategories.includes(category)}
                            onCheckedChange={(checked) => handlePriceCategoryChange(category, checked as boolean)}
                          />
                          <label
                            htmlFor={`price-${category}`}
                            className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
                          >
                            {category} {category === "Budget" && "($0-$15)"}
                            {category === "Standard" && "($15-$30)"}
                            {category === "Premium" && "($30+)"}
                          </label>
                        </motion.div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Custom Price Range */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
                      <span className="text-sm font-medium text-white group-hover:text-orange-500 transition-colors">
                        Custom Range: ${priceRange[0]} - ${priceRange[1]}
                      </span>
                      <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </motion.div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={1} className="w-full" />
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Rating Filter */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
                      <span className="text-sm font-medium text-white group-hover:text-orange-500 transition-colors">
                        Minimum Rating
                      </span>
                      <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </motion.div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {[4, 3, 2, 1].map((rating, index) => (
                        <motion.div
                          key={rating}
                          className="flex items-center space-x-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={selectedRatings.includes(rating)}
                            onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                          />
                          <label
                            htmlFor={`rating-${rating}`}
                            className="text-sm text-gray-300 flex items-center hover:text-white transition-colors cursor-pointer"
                          >
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                            <span className="ml-1">& up</span>
                          </label>
                        </motion.div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Discount Filter */}
                  <motion.div className="flex items-center space-x-2" whileHover={{ x: 5 }}>
                    <Checkbox
                      id="on-sale"
                      checked={onSaleOnly}
                      onCheckedChange={(checked) => setOnSaleOnly(checked as boolean)}
                    />
                    <label
                      htmlFor="on-sale"
                      className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      On Sale Only
                    </label>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              ref={scriptsRef}
              className="flex-1"
              initial={{ opacity: 0, x: 50 }}
              animate={scriptsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              {/* Search and Sort Bar */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex-1 relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-orange-500 transition-colors" />
                  <Input
                    type="search"
                    placeholder="Search scripts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-900/30 border-gray-700/50 text-white placeholder-gray-400 focus:border-orange-500 focus:bg-gray-900/50 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 bg-gray-900/30 border-gray-700/50 text-white backdrop-blur-sm">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 border-gray-700/50 backdrop-blur-xl">
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                <div className="flex border border-gray-700/50 rounded-md backdrop-blur-sm">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Active Filters */}
              <AnimatePresence>
                {activeFiltersCount > 0 && (
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.05 }}
                    >
                      {selectedCategories.map((category, index) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-orange-500/20 text-orange-400 border-orange-500/30 flex items-center gap-1 backdrop-blur-sm"
                          >
                            {categories.find((c) => c.id === category)?.name}
                            <motion.button
                              onClick={() => removeFilter("category", category)}
                              className="hover:text-white transition-colors"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                            >
                              <X className="h-3 w-3" />
                            </motion.button>
                          </Badge>
                        </motion.div>
                      ))}
                      {selectedFrameworks.map((framework, index) => (
                        <motion.div
                          key={framework}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-blue-500/20 text-blue-400 border-blue-500/30 flex items-center gap-1 backdrop-blur-sm"
                          >
                            {framework}
                            <motion.button
                              onClick={() => removeFilter("framework", framework)}
                              className="hover:text-white transition-colors"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                            >
                              <X className="h-3 w-3" />
                            </motion.button>
                          </Badge>
                        </motion.div>
                      ))}
                      {selectedPriceCategories.map((category, index) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 flex items-center gap-1 backdrop-blur-sm"
                          >
                            {category}
                            <motion.button
                              onClick={() => removeFilter("priceCategory", category)}
                              className="hover:text-white transition-colors"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                            >
                              <X className="h-3 w-3" />
                            </motion.button>
                          </Badge>
                        </motion.div>
                      ))}
                      {selectedRatings.map((rating, index) => (
                        <motion.div
                          key={rating}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1 backdrop-blur-sm"
                          >
                            {rating}+ stars
                            <motion.button
                              onClick={() => removeFilter("rating", rating)}
                              className="hover:text-white transition-colors"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                            >
                              <X className="h-3 w-3" />
                            </motion.button>
                          </Badge>
                        </motion.div>
                      ))}
                      {onSaleOnly && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-1 backdrop-blur-sm"
                          >
                            On Sale
                            <motion.button
                              onClick={() => setOnSaleOnly(false)}
                              className="hover:text-white transition-colors"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                            >
                              <X className="h-3 w-3" />
                            </motion.button>
                          </Badge>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Count */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gray-400 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-orange-500" />
                  Showing {sortedScripts.length} of {allScripts.length} scripts
                  {searchQuery && (
                    <span className="text-orange-500">
                      for "<span className="font-semibold">{searchQuery}</span>"
                    </span>
                  )}
                </p>
              </motion.div>

              {/* Scripts Grid/List */}
              <AnimatePresence mode="wait">
                {sortedScripts.length === 0 ? (
                  <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="mb-6"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Search className="h-16 w-16 text-gray-600 mx-auto" />
                    </motion.div>
                    <p className="text-gray-400 text-xl mb-6">No scripts found matching your criteria</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={clearAllFilters}
                        className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-semibold"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Clear All Filters
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    className={
                      viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"
                    }
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                  >
                    {sortedScripts.map((script, index) => (
                      <motion.div
                        key={script.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="group"
                      >
                        <Card
                          className={`bg-gray-800/30 border-gray-700/50 hover:border-orange-500/50 transition-all duration-500 cursor-pointer h-full backdrop-blur-sm relative overflow-hidden ${viewMode === "list" ? "flex" : ""}`}
                        >
                          {/* Animated background on hover */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            initial={false}
                          />

                          <CardHeader className={`p-0 relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                            <div className="relative overflow-hidden">
                              <motion.img
                                src={script.image || "/placeholder.svg"}
                                alt={script.title}
                                className={`object-cover transition-transform duration-500 group-hover:scale-110 ${viewMode === "list" ? "w-full h-32 rounded-l-lg" : "w-full h-48 rounded-t-lg"}`}
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                initial={false}
                              />
                              {script.discount > 0 && (
                                <motion.div
                                  className="absolute top-2 left-2"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
                                    -{script.discount}%
                                  </Badge>
                                </motion.div>
                              )}
                              <motion.div
                                className="absolute top-2 right-2"
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: index * 0.05 + 0.1 }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <Badge className="bg-black/80 text-white backdrop-blur-sm">{script.framework}</Badge>
                              </motion.div>
                            </div>
                          </CardHeader>

                          <CardContent className={`p-4 relative z-10 ${viewMode === "list" ? "flex-1" : ""}`}>
                            <div className={viewMode === "list" ? "flex justify-between h-full" : ""}>
                              <div className={viewMode === "list" ? "flex-1 pr-4" : ""}>
                                <CardTitle className="text-white text-lg mb-2 group-hover:text-orange-500 transition-colors duration-300">
                                  <Link href={`/script/${script.id}`} className="hover:underline">
                                    {script.title}
                                  </Link>
                                </CardTitle>
                                <CardDescription className="text-gray-400 text-sm mb-3 leading-relaxed">
                                  {script.description}
                                </CardDescription>
                                <div className="flex items-center mb-3">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 + i * 0.02 }}
                                      >
                                        <Star
                                          className={`h-4 w-4 ${
                                            i < Math.floor(script.rating)
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-600"
                                          }`}
                                        />
                                      </motion.div>
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-400 ml-2">
                                    {script.rating} ({script.reviews})
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-gray-700/50 text-gray-300 backdrop-blur-sm"
                                    >
                                      {script.categoryName}
                                    </Badge>
                                  </motion.div>
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 + 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-gray-700/50 text-gray-300 backdrop-blur-sm"
                                    >
                                      {script.priceCategory}
                                    </Badge>
                                  </motion.div>
                                </div>
                                <div className="text-xs text-gray-500">by {script.seller}</div>
                              </div>
                              <div
                                className={`${viewMode === "list" ? "flex flex-col justify-between items-end" : "flex items-center justify-between mt-4"}`}
                              >
                                <div
                                  className={`${viewMode === "list" ? "text-right mb-4" : "flex items-center space-x-2"}`}
                                >
                                  <motion.span
                                    className="text-orange-500 font-bold text-lg"
                                    animate={{
                                      textShadow: [
                                        "0 0 0px currentColor",
                                        "0 0 10px currentColor",
                                        "0 0 0px currentColor",
                                      ],
                                    }}
                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.1 }}
                                  >
                                    ${script.price}
                                  </motion.span>
                                  {script.originalPrice && (
                                    <span className="text-gray-500 line-through text-sm">${script.originalPrice}</span>
                                  )}
                                </div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-black font-semibold shadow-lg"
                                  >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Add to Cart
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {sortedScripts.length > 0 && (
                <motion.div
                  className="flex justify-center mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex space-x-2">
                    {["Previous", "1", "2", "3", "Next"].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={item === "1" ? "default" : "outline"}
                          className={
                            item === "1"
                              ? "bg-orange-500 text-white"
                              : "bg-gray-900/30 border-gray-700/50 text-white hover:bg-orange-500 hover:border-orange-500 backdrop-blur-sm"
                          }
                        >
                          {item}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

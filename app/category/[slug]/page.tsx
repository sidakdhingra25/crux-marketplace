"use client"

import { useState } from "react"
import { Search, Filter, Star, ShoppingCart, Grid, List, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [sortBy, setSortBy] = useState("popular")
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [selectedPriceCategories, setSelectedPriceCategories] = useState<string[]>([])

  // Category information
  const categoryInfo = {
    economy: {
      name: "Economy Scripts",
      description: "Banking systems, shops, businesses, and financial management scripts",
      totalScripts: 45,
    },
    vehicles: {
      name: "Vehicle Scripts",
      description: "Car dealerships, garages, vehicle management, and automotive scripts",
      totalScripts: 32,
    },
    jobs: {
      name: "Job Scripts",
      description: "Police, EMS, mechanic, and other career-based roleplay scripts",
      totalScripts: 28,
    },
    housing: {
      name: "Housing Scripts",
      description: "Property systems, apartments, real estate, and housing management",
      totalScripts: 19,
    },
    medical: {
      name: "Medical Scripts",
      description: "Hospital systems, medical equipment, and healthcare scripts",
      totalScripts: 15,
    },
    police: {
      name: "Police Scripts",
      description: "Law enforcement tools, MDT systems, and police equipment",
      totalScripts: 23,
    },
    utilities: {
      name: "Utility Scripts",
      description: "Admin tools, utilities, and helper scripts for server management",
      totalScripts: 31,
    },
    core: {
      name: "Core Scripts",
      description: "Framework scripts, core systems, and essential server components",
      totalScripts: 18,
    },
  }

  const currentCategory = categoryInfo[categorySlug as keyof typeof categoryInfo] || categoryInfo.economy

  const scripts = [
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
      category: "Economy",
      seller: "ScriptMaster",
      discount: 28,
      framework: "QBCore",
      priceCategory: "Premium",
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
      category: "Vehicles",
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
      category: "Jobs",
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
      category: "Medical",
      seller: "MedScript",
      discount: 0,
      framework: "Standalone",
      priceCategory: "Premium",
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
      category: "Housing",
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
      category: "Core",
      seller: "BudgetDev",
      discount: 0,
      framework: "ESX",
      priceCategory: "Budget",
      tags: ["Inventory", "Core", "Items"],
      lastUpdated: "2024-01-03",
    },
  ]

  const frameworks = ["All Frameworks", "QBCore", "ESX", "Standalone", "vRP", "Custom"]
  const priceCategories = ["Budget ($0-$15)", "Standard ($15-$30)", "Premium ($30+)"]

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

  const sortedScripts = [...scripts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      default:
        return b.reviews - a.reviews // Popular (by review count)
    }
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-orange-500">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">{currentCategory.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-white mb-2">{currentCategory.name}</h1>
          <p className="text-gray-400 mb-4">{currentCategory.description}</p>
          <div className="text-sm text-gray-500">{currentCategory.totalScripts} scripts available</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Framework Filter */}
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <span className="text-sm font-medium text-white">Framework</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {frameworks.slice(1).map((framework) => (
                      <div key={framework} className="flex items-center space-x-2">
                        <Checkbox
                          id={`framework-${framework}`}
                          checked={selectedFrameworks.includes(framework)}
                          onCheckedChange={(checked) => handleFrameworkChange(framework, checked as boolean)}
                        />
                        <label htmlFor={`framework-${framework}`} className="text-sm text-gray-300">
                          {framework}
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Price Categories */}
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <span className="text-sm font-medium text-white">Price Range</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {priceCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`price-${category}`}
                          checked={selectedPriceCategories.includes(category)}
                          onCheckedChange={(checked) => handlePriceCategoryChange(category, checked as boolean)}
                        />
                        <label htmlFor={`price-${category}`} className="text-sm text-gray-300">
                          {category}
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Custom Price Range */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <span className="text-sm font-medium text-white">
                      Custom Range: ${priceRange[0]} - ${priceRange[1]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={1} className="w-full" />
                  </CollapsibleContent>
                </Collapsible>

                {/* Rating Filter */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <span className="text-sm font-medium text-white">Minimum Rating</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`} className="text-sm text-gray-300 flex items-center">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="ml-1">& up</span>
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Discount Filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="on-sale" />
                  <label htmlFor="on-sale" className="text-sm text-gray-300">
                    On Sale Only
                  </label>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full bg-gray-900 border-gray-700 text-white hover:bg-orange-500 hover:border-orange-500"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search scripts..."
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border border-gray-700 rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-orange-500 text-white" : "text-gray-400"}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-orange-500 text-white" : "text-gray-400"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedFrameworks.length > 0 || selectedPriceCategories.length > 0) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedFrameworks.map((framework) => (
                    <Badge
                      key={framework}
                      variant="secondary"
                      className="bg-orange-500/20 text-orange-400 border-orange-500/30"
                    >
                      {framework}
                      <button onClick={() => handleFrameworkChange(framework, false)} className="ml-2 hover:text-white">
                        ×
                      </button>
                    </Badge>
                  ))}
                  {selectedPriceCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    >
                      {category}
                      <button
                        onClick={() => handlePriceCategoryChange(category, false)}
                        className="ml-2 hover:text-white"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-400">Showing {sortedScripts.length} results</p>
            </div>

            {/* Scripts Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {sortedScripts.map((script) => (
                <Card
                  key={script.id}
                  className={`bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors group ${viewMode === "list" ? "flex" : ""}`}
                >
                  <CardHeader className={`p-0 ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    <div className="relative">
                      <img
                        src={script.image || "/cat.jpg"}
                        alt={script.title}
                        className={`object-cover ${viewMode === "list" ? "w-full h-32" : "w-full h-48"} ${viewMode === "list" ? "rounded-l-lg" : "rounded-t-lg"}`}
                      />
                      {script.discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-orange-500 text-white">-{script.discount}%</Badge>
                      )}
                      <Badge className="absolute top-2 right-2 bg-black/80 text-white">{script.framework}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className={viewMode === "list" ? "flex justify-between h-full" : ""}>
                      <div className={viewMode === "list" ? "flex-1 pr-4" : ""}>
                        <CardTitle className="text-white text-lg mb-2 group-hover:text-orange-500 transition-colors">
                          <Link href={`/script/${script.id}`}>{script.title}</Link>
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-sm mb-3">{script.description}</CardDescription>
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(script.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400 ml-2">
                            {script.rating} ({script.reviews})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                            {script.priceCategory}
                          </Badge>
                          {script.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">by {script.seller}</div>
                      </div>
                      <div
                        className={`${viewMode === "list" ? "flex flex-col justify-between items-end" : "flex items-center justify-between mt-4"}`}
                      >
                        <div className={`${viewMode === "list" ? "text-right mb-4" : "flex items-center space-x-2"}`}>
                          <span className="text-orange-500 font-bold text-lg">${script.price}</span>
                          {script.originalPrice && (
                            <span className="text-gray-500 line-through text-sm">${script.originalPrice}</span>
                          )}
                        </div>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="bg-gray-900 border-gray-700 text-white hover:bg-orange-500 hover:border-orange-500"
                >
                  Previous
                </Button>
                <Button className="bg-orange-500 text-white">1</Button>
                <Button
                  variant="outline"
                  className="bg-gray-900 border-gray-700 text-white hover:bg-orange-500 hover:border-orange-500"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  className="bg-gray-900 border-gray-700 text-white hover:bg-orange-500 hover:border-orange-500"
                >
                  3
                </Button>
                <Button
                  variant="outline"
                  className="bg-gray-900 border-gray-700 text-white hover:bg-orange-500 hover:border-orange-500"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

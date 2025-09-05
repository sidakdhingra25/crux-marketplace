"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Megaphone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Ad {
  id: number
  title: string
  description: string
  image_url?: string
  link_url?: string
  category: string
  status: string
  priority: number
  created_at: string
}

interface AdCardProps {
  ad: Ad
  className?: string
}

export default function AdCard({ ad, className = "" }: AdCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleClick = () => {
    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card 
        className={`bg-gradient-to-br from-orange-500/10 to-yellow-400/10 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 cursor-pointer group ${ad.link_url ? 'hover:shadow-lg hover:shadow-orange-500/20' : ''}`}
        onClick={handleClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-orange-400" />
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                Advertisement
              </Badge>
            </div>
            {ad.link_url && (
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
            )}
          </div>
          <CardTitle className="text-white text-lg group-hover:text-orange-400 transition-colors">
            {ad.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-300 mb-4">
            {ad.description}
          </CardDescription>
          
          {ad.image_url && !imageError && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-gray-700/50 text-gray-300">
              {ad.category}
            </Badge>
            {ad.link_url && (
              <span className="text-sm text-orange-400 group-hover:text-orange-300 transition-colors">
                Click to learn more →
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Hook for getting random ads
export function useRandomAds(ads: Ad[], count: number = 1) {
  const [randomAds, setRandomAds] = useState<Ad[]>([])

  useEffect(() => {
    if (ads.length === 0) {
      setRandomAds([])
      return
    }

    const activeAds = ads.filter(ad => ad.status === 'active')
    if (activeAds.length === 0) {
      setRandomAds([])
      return
    }

    // Shuffle and select random ads
    const shuffled = [...activeAds].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(count, shuffled.length))
    setRandomAds(selected)
  }, [ads, count])

  return randomAds
}


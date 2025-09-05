"use client"

import { useParams } from "next/navigation"

export default function TestPage() {
  const params = useParams()
  const giveawayId = params.id as string

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'red', fontSize: '48px' }}>TEST PAGE</h1>
      <p style={{ color: 'yellow', fontSize: '32px' }}>Giveaway ID: {giveawayId}</p>
      <p style={{ color: 'lime', fontSize: '28px' }}>If you can see this, the page is working!</p>
      
      <div style={{ 
        position: 'fixed', 
        top: '50px', 
        right: '50px', 
        background: 'blue', 
        color: 'white', 
        padding: '20px',
        borderRadius: '10px',
        fontSize: '20px'
      }}>
        Fixed Position Test
      </div>
      
      <div style={{ 
        background: 'green', 
        color: 'black', 
        padding: '20px',
        margin: '20px 0',
        borderRadius: '10px'
      }}>
        Regular Content Test
      </div>
    </div>
  )
}


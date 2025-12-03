'use client'

import { useState, useEffect } from 'react'
import ChristmasPopup from './ChristmasPopup'

export default function ChristmasPopupManager() {
  const [showPopup, setShowPopup] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted (client-side only)
    setMounted(true)
    
    // Check if user has already submitted or closed the popup
    const checkAndShow = () => {
      try {
        const submitted = localStorage.getItem('christmas_popup_submitted')
        const closed = localStorage.getItem('christmas_popup_closed')
        
        if (submitted === 'true' || closed === 'true') {
          return
        }
      } catch (error) {
        // localStorage might not be available, continue anyway
      }

      // Show popup immediately after page load
      setTimeout(() => {
        setShowPopup(true)
      }, 1000) // 1 second delay to ensure page is fully loaded
    }

    checkAndShow()
  }, [])

  // Don't render anything until mounted
  if (!mounted) {
    return null
  }

  const handleClose = () => {
    setShowPopup(false)
    // Save to localStorage so it doesn't show again
    localStorage.setItem('christmas_popup_closed', 'true')
  }

  const handleSubmit = async (email: string) => {
    try {
      // Save lead to API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          source: 'christmas_popup',
          campaign: 'christmas_2024'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save lead')
      }
    } catch (error) {
      // Silently fail - we don't want to show error to user
      // The lead is still saved in localStorage
      console.error('Error saving lead:', error)
    }
  }

  if (!showPopup) {
    return null
  }

  return (
    <ChristmasPopup
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  )
}


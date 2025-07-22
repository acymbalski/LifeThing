import React, { useState, useRef, useEffect, useCallback } from 'react'

type DraggableWrapperProps = {
  children: React.ReactNode
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean | ((prev: boolean) => boolean)) => void
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({ children, isExpanded, setIsExpanded }) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 60, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  
  // Use refs for immediate updates without re-renders
  const positionRef = useRef({ x: window.innerWidth - 60, y: 20 })
  const dragStart = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  // Update position ref when position state changes
  useEffect(() => {
    positionRef.current = position
  }, [position])

  const getEventCoordinates = useCallback((e: React.PointerEvent | PointerEvent) => {
    return { x: e.clientX, y: e.clientY }
  }, [])

  // Ultra-optimized drag handler with direct DOM manipulation
  const handleDragOptimized = useCallback((e: PointerEvent) => {
    if (!dragStart.current || !isDraggingRef.current) return
    
    e.preventDefault()
    
    const coords = getEventCoordinates(e)
    const deltaX = coords.x - dragStart.current.x
    const deltaY = coords.y - dragStart.current.y
    const newX = Math.max(0, Math.min(window.innerWidth - 40, dragStart.current.posX + deltaX))
    const newY = Math.max(0, Math.min(window.innerHeight - 40, dragStart.current.posY + deltaY))
    
    // Direct DOM manipulation for maximum performance - no React involved
    if (elementRef.current) {
      elementRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`
    }
    
    // Update ref for final state sync
    positionRef.current = { x: newX, y: newY }
  }, [getEventCoordinates])

  const handleDragStart = useCallback((e: React.PointerEvent) => {
    if (isExpanded) return
    
    e.preventDefault()
    e.stopPropagation()
    
    // Set pointer capture
    if (elementRef.current) {
      elementRef.current.setPointerCapture(e.pointerId)
      // Enable GPU acceleration hint
      elementRef.current.style.willChange = 'transform'
    }
    
    const coords = getEventCoordinates(e)
    
    // Update both React state and ref
    setIsDragging(true)
    isDraggingRef.current = true
    
    dragStart.current = {
      x: coords.x,
      y: coords.y,
      posX: positionRef.current.x,
      posY: positionRef.current.y,
    }
  }, [isExpanded, getEventCoordinates])

  const handleDragEnd = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    
    e.preventDefault()
    e.stopPropagation()
    
    // Release pointer capture and remove performance hints
    if (elementRef.current) {
      elementRef.current.releasePointerCapture(e.pointerId)
      elementRef.current.style.willChange = 'auto'
    }
    
    // Update React state with final position
    setIsDragging(false)
    isDraggingRef.current = false
    setPosition({ ...positionRef.current })
    
    dragStart.current = null
  }, [])

  // Global pointer event handlers for maximum performance
  useEffect(() => {
    if (!isDragging) return

    const handleGlobalPointerUp = (e: PointerEvent) => {
      e.preventDefault()
      
      // Clean up
      if (elementRef.current) {
        elementRef.current.style.willChange = 'auto'
      }
      
      setIsDragging(false)
      isDraggingRef.current = false
      
      // Sync final position to React state
      setPosition({ ...positionRef.current })
      
      dragStart.current = null
    }

    const handleGlobalPointerCancel = (e: PointerEvent) => {
      handleGlobalPointerUp(e)
    }

    // Use passive: false for preventDefault to work, but only for pointerup
    // Use the optimized handler for pointermove
    document.addEventListener('pointermove', handleDragOptimized, { passive: false })
    document.addEventListener('pointerup', handleGlobalPointerUp, { passive: false })
    document.addEventListener('pointercancel', handleGlobalPointerCancel, { passive: false })

    return () => {
      document.removeEventListener('pointermove', handleDragOptimized)
      document.removeEventListener('pointerup', handleGlobalPointerUp)
      document.removeEventListener('pointercancel', handleGlobalPointerCancel)
    }
  }, [isDragging, handleDragOptimized])

  // Initialize position with transform and set up initial styles
  useEffect(() => {
    if (elementRef.current && !isExpanded) {
      elementRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`
      // Optimize for transforms
      elementRef.current.style.backfaceVisibility = 'hidden'
      elementRef.current.style.perspective = '1000px'
    }
  }, [position, isExpanded])

  // Handle window resize to keep element in bounds
  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - 40
      const maxY = window.innerHeight - 40
      
      if (positionRef.current.x > maxX || positionRef.current.y > maxY) {
        const newPos = {
          x: Math.min(positionRef.current.x, maxX),
          y: Math.min(positionRef.current.y, maxY)
        }
        
        positionRef.current = newPos
        setPosition(newPos)
        
        if (elementRef.current && !isExpanded) {
          elementRef.current.style.transform = `translate3d(${newPos.x}px, ${newPos.y}px, 0)`
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isExpanded])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
    }
  }, [isDragging])

  const handleExpandToggle = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  return (
    <div
      ref={elementRef}
      className={`fixed select-none ${
        isExpanded
          ? 'bg-gray-900/95 z-50 transition-all duration-300'
          : 'w-10 h-10 rounded-lg bg-gray-900/90 z-40'
      }`}
      style={{
        // Only use top/left for expanded state, transform for dragging
        ...(isExpanded ? {} : { 
          top: 0, 
          left: 0,
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          // Performance optimizations
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          willChange: isDragging ? 'transform' : 'auto'
        }),
        touchAction: 'none',
        // Prevent text selection and highlighting
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      onContextMenu={handleContextMenu}
    >
      <div
        className={`h-full ${!isExpanded ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
        onPointerDown={!isExpanded ? handleDragStart : undefined}
        onPointerUp={!isExpanded ? handleDragEnd : undefined}
        onPointerCancel={!isExpanded ? handleDragEnd : undefined}
        style={{
          touchAction: !isExpanded ? 'none' : 'auto'
        }}
      >
        {isExpanded ? (
          children
        ) : (
          <button
            onClick={handleExpandToggle}
            className="w-full h-full flex items-center justify-center text-white hover:text-gray-300 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            ⚙️
          </button>
        )}
      </div>
    </div>
  )
}

export default DraggableWrapper

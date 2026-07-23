import React, { useEffect, useRef } from 'react'

// Minimal, professional starfield — fewer stars, subtler appearance
export default function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Fewer, subtler stars for professional look
    const STAR_COUNT = 60
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.3 + 0.05,
      alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.002,
      speed: Math.random() * 0.08 + 0.02,
    }))

    // Very subtle orbit lines (2–3 ellipses)
    const orbits = [
      { rx: 220, ry: 80, cx: 0.5, cy: 0.5, color: 'rgba(59,130,246,0.04)' },
      { rx: 320, ry: 120, cx: 0.5, cy: 0.5, color: 'rgba(16,185,129,0.03)' },
    ]

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw orbit ellipses
      orbits.forEach(o => {
        ctx.beginPath()
        ctx.ellipse(canvas.width * o.cx, canvas.height * o.cy, o.rx, o.ry, Math.PI / 6, 0, Math.PI * 2)
        ctx.strokeStyle = o.color
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Draw stars
      stars.forEach(s => {
        s.alpha += s.alphaDir
        if (s.alpha > 0.35 || s.alpha < 0.05) s.alphaDir *= -1
        s.y += s.speed
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width }

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(148,163,184,${s.alpha})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return <canvas ref={canvasRef} className="stars-bg" />
}

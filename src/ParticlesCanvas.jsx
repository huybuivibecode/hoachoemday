import React, { useEffect, useRef } from 'react'

export default function ParticlesCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Petal class
    const petals = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 10,
      speedX: Math.random() * 1.2 - 0.6,
      speedY: Math.random() * 1.5 + 1.2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.4 ? '#f596ad' : '#fbcfe8',
      alpha: Math.random() * 0.45 + 0.45,
    }))

    // Click sparks
    const sparks = []

    const spawnSparks = (x, y) => {
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 4 + 1.5
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          radius: Math.random() * 4 + 2,
          color: Math.random() > 0.5 ? '#fcd34d' : '#f472b6',
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
        })
      }
    }

    const handleClick = (e) => {
      spawnSparks(e.clientX, e.clientY)
    }

    const handleTouch = (e) => {
      if (e.touches && e.touches[0]) {
        spawnSparks(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener('click', handleClick)
    window.addEventListener('touchstart', handleTouch, { passive: true })

    const drawPetal = (x, y, size, rotation, color, alpha) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.globalAlpha = alpha

      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.bezierCurveTo(size * 0.8, -size * 0.6, size * 0.8, size * 0.6, 0, size)
      ctx.bezierCurveTo(-size * 0.8, size * 0.6, -size * 0.8, -size * 0.6, 0, -size)
      ctx.fillStyle = color
      ctx.fill()

      // Delicate petal inner vein
      ctx.beginPath()
      ctx.moveTo(0, -size * 0.8)
      ctx.lineTo(0, size * 0.7)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.restore()
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Animate and draw ambient petals
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i]
        p.wobble += p.wobbleSpeed
        p.x += p.speedX + Math.sin(p.wobble) * 0.8
        p.y += p.speedY
        p.rotation += p.rotSpeed

        if (p.y > height + 20) {
          p.y = -20
          p.x = Math.random() * width
        }
        if (p.x > width + 20) p.x = -20
        if (p.x < -20) p.x = width + 20

        drawPetal(p.x, p.y, p.size, p.rotation, p.color, p.alpha)
      }

      // Animate and draw click sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.1 // gravity
        s.alpha -= s.decay

        if (s.alpha <= 0) {
          sparks.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.fillStyle = s.color
        ctx.shadowColor = s.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchstart', handleTouch)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
      aria-hidden="true"
    />
  )
}

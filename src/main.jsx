import React, { useState, useEffect, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion } from 'framer-motion'
import './styles.css'
import gardenWebp from './assets/pastel-rose-garden.webp'
import ParticlesCanvas from './ParticlesCanvas'
import { toggleMusic, playChime } from './sound'

const LETTER = {
  salutation: 'Gửi những người phụ nữ tuyệt vời,',
  paragraphs: [
    'Nhân Ngày Phụ nữ Việt Nam 20/10, xin gửi đến bạn lời chúc chân thành nhất.',
    'Cảm ơn bạn vì những điều giản dị nhưng ý nghĩa mà bạn mang đến mỗi ngày. Đó có thể là sự quan tâm dành cho gia đình, tinh thần trách nhiệm trong công việc, sự kiên trì trước những thử thách hay chỉ đơn giản là một nụ cười giúp ai đó có thêm động lực.',
    'Cuộc sống không phải lúc nào cũng dễ dàng. Sẽ có những ngày bạn cảm thấy mệt mỏi, áp lực hoặc phải đối mặt với nhiều lựa chọn khó khăn. Mong rằng dù ở bất kỳ hoàn cảnh nào, bạn vẫn luôn giữ được niềm tin vào bản thân, bởi những giá trị bạn tạo ra luôn có ý nghĩa theo cách riêng của mình.',
    'Chúc bạn luôn có thật nhiều sức khỏe để theo đuổi những dự định còn dang dở. Chúc bạn có đủ bình yên để tận hưởng những điều nhỏ bé trong cuộc sống, đủ bản lĩnh để vượt qua thử thách và đủ yêu thương để trái tim luôn ấm áp.',
    'Mong rằng bạn sẽ luôn được trân trọng, được lắng nghe và được đồng hành bởi những người chân thành. Và trên hết, mong bạn luôn dành cho chính mình sự quan tâm, sự yêu thương và khoảng thời gian để nghỉ ngơi, bởi bạn cũng xứng đáng nhận được những điều tốt đẹp.',
    'Chúc bạn có một ngày 20/10 tràn ngập niềm vui, nhiều tiếng cười và những kỷ niệm đáng nhớ.',
  ],
  closing: 'Chúc mừng Ngày Phụ nữ Việt Nam 20/10.',
  signature: 'Trân trọng.',
}

// Lush SVG Rose illustration
function Rose({ s = 1, color = '#f58fa9' }) {
  return (
    <g className="hero-rose-container" transform={`scale(${s})`}>
      {/* Soft glowing aura behind the bloom */}
      <circle cx="500" cy="380" r="140" fill="url(#roseGlow)" opacity="0.65" />

      {/* Stem */}
      <path className="stem" d="M500 410 C496 460, 508 510, 498 570 C494 590, 502 620, 500 640" />

      {/* Thorns */}
      <path d="M497 480 Q485 476 480 472 Q492 485 498 488" fill="#2d523c" />
      <path d="M503 530 Q515 526 520 522 Q508 535 502 538" fill="#2d523c" />

      {/* Left Leaf */}
      <g>
        <path className="leaf" d="M497 495 C450 470, 435 510, 482 522 C495 520, 498 508, 497 495 Z" />
        <path d="M496 502 Q460 495 445 498" stroke="#1d3826" strokeWidth="1" fill="none" />
      </g>

      {/* Right Leaf */}
      <g>
        <path className="leaf right" d="M503 520 C550 490, 565 530, 518 545 C505 542, 502 530, 503 520 Z" />
        <path d="M504 528 Q540 518 555 522" stroke="#1d3826" strokeWidth="1" fill="none" />
      </g>

      {/* Rose Bloom Group */}
      <g className="bloom" style={{ '--petal': color }}>
        {/* Outer Petals */}
        <ellipse rx="36" ry="18" cx="500" cy="365" transform="rotate(-30 500 365)" />
        <ellipse rx="36" ry="18" cx="500" cy="365" transform="rotate(30 500 365)" />
        <ellipse rx="38" ry="19" cx="500" cy="375" transform="rotate(80 500 375)" />
        <ellipse rx="38" ry="19" cx="500" cy="375" transform="rotate(-80 500 375)" />
        <ellipse rx="34" ry="17" cx="500" cy="390" transform="rotate(130 500 390)" />
        <ellipse rx="34" ry="17" cx="500" cy="390" transform="rotate(-130 500 390)" />

        {/* Mid Petals */}
        <circle className="rose-disc" cx="500" cy="380" r="32" />
        <ellipse rx="26" ry="14" cx="500" cy="370" transform="rotate(20 500 370)" />
        <ellipse rx="26" ry="14" cx="500" cy="370" transform="rotate(-40 500 370)" />
        <ellipse rx="24" ry="12" cx="500" cy="385" transform="rotate(90 500 385)" />

        {/* Center Swirl */}
        <path
          className="rose-swirl"
          d="M500 380 c12 0 14 -16 1 -17 c -18 1 -20 28 -2 34 c 22 7 36 -22 17 -40 c -27 -25 -60 0 -50 36 c 10 38 64 38 78 2"
        />
      </g>
    </g>
  )
}

function GardenScene({ grown, onRoseClick }) {
  return (
    <div className={`garden ${grown ? 'grown' : ''}`} aria-hidden="true">
      {/* Background artwork */}
      <img
        className="garden-art"
        src={gardenWebp}
        alt="Khu vườn hoa hồng pastel"
        loading="eager"
      />

      {/* Floating clouds in sky */}
      <div className="cloud c1" />
      <div className="cloud c2" />

      {/* Central SVG Rose */}
      <svg
        className="hero-rose-svg"
        viewBox="0 0 1000 750"
        preserveAspectRatio="xMidYMid meet"
        onClick={onRoseClick}
      >
        <defs>
          <radialGradient id="roseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#f472b6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <Rose s={1.65} color="#e65a7d" />
      </svg>
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [isLetterOpen, setIsLetterOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [isMusicActive, setIsMusicActive] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? '' : prev))
    }, 2500)
  }, [])

  const handleStart = () => {
    setStarted(true)
    playChime()
  }

  const handleOpenLetter = () => {
    playChime()
    setIsLetterOpen(true)
  }

  const handleToggleMusic = () => {
    const active = toggleMusic((state) => {
      setIsMusicActive(state)
    })
    setIsMusicActive(active)
    showToast(active ? 'Đã bật nhạc nền ♫' : 'Đã tắt nhạc nền ✕')
  }

  const handleCopyLetter = () => {
    const salutation = recipient ? `Gửi ${recipient} thân thương,\n\n` : `${LETTER.salutation}\n\n`
    const body = LETTER.paragraphs.join('\n\n')
    const fullText = `${salutation}${body}\n\n${LETTER.closing}\n\n${LETTER.signature}`

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(fullText)
        .then(() => showToast('Đã sao chép bức thư vào bộ nhớ tạm! 💌'))
        .catch(() => showToast('Vui lòng chọn và sao chép thủ công!'))
    } else {
      showToast('Đã lưu bức thư!')
    }
  }

  // Close letter on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLetterOpen(false)
        setIsEditingName(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <main>
      {/* 60fps Canvas for ambient petals and touch sparkles */}
      <ParticlesCanvas />

      {/* Visual garden scene */}
      <GardenScene grown={started} onRoseClick={!started ? handleStart : undefined} />

      {/* Subtle film grain texture */}
      <div className="film-grain" />

      {/* Top Floating Bar */}
      <header className="top-nav">
        <div className="date-badge">
          <span>🌸</span>
          <span>20 . 10 . 2026</span>
        </div>

        <div className="nav-actions">
          <button
            className="nav-btn"
            onClick={() => setIsEditingName((prev) => !prev)}
            title="Đổi tên người nhận"
          >
            <span>💌</span>
            <span>{recipient ? `Tặng: ${recipient}` : 'Thêm tên người nhận'}</span>
          </button>

          <button
            className="nav-btn"
            onClick={handleToggleMusic}
            title={isMusicActive ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
            aria-label="Bật/Tắt âm nhạc"
          >
            <span>{isMusicActive ? '♫' : '✕'}</span>
            <span>{isMusicActive ? 'Nhạc nền: Bật' : 'Nhạc nền: Tắt'}</span>
          </button>
        </div>
      </header>

      {/* Modal for Recipient Name Editing */}
      <AnimatePresence>
        {isEditingName && (
          <div className="letter-overlay" onClick={() => setIsEditingName(false)}>
            <motion.div
              className="letter-modal"
              style={{ maxWidth: 420 }}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
            >
              <button
                className="letter-close-btn"
                onClick={() => setIsEditingName(false)}
                aria-label="Đóng"
              >
                ×
              </button>
              <span className="letter-ornament">💌</span>
              <h3 className="letter-heading" style={{ fontSize: 22, marginBottom: 12 }}>
                Dành tặng ai đó đặc biệt?
              </h3>
              <p className="intro-desc" style={{ marginBottom: 16 }}>
                Nhập tên người phụ nữ bạn muốn gửi gắm bức thư yêu thương này:
              </p>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ví dụ: Mẹ yêu, Lan Anh, Em, Chị gái,..."
                maxLength={30}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(220, 160, 180, 0.6)',
                  fontSize: '15px',
                  marginBottom: '20px',
                  outline: 'none',
                  background: '#fdf8f9',
                  color: '#3f2231',
                  boxSizing: 'border-box',
                }}
              />
              <div className="letter-actions">
                <button
                  className="btn-action-primary"
                  onClick={() => {
                    setIsEditingName(false)
                    showToast(recipient ? `Đã lưu tặng: ${recipient} 🌸` : 'Đã xóa tên người nhận!')
                  }}
                >
                  Xác nhận
                </button>
                {recipient && (
                  <button
                    className="btn-action-secondary"
                    onClick={() => {
                      setRecipient('')
                      setIsEditingName(false)
                    }}
                  >
                    Bỏ tên
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Transitions */}
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.section
            key="intro"
            className="intro-section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.6 } }}
          >
            <p className="intro-subtitle">
              {recipient ? `Gửi tặng ${recipient} thương yêu ✨` : 'Gửi những người phụ nữ tuyệt vời ✨'}
            </p>
            <h1 className="intro-title">Từ một đóa hoa nhỏ…</h1>
            <p className="intro-desc">
              Chạm nhẹ vào bông hoa hoặc nút bên dưới để mở ra bức thư dịu dàng và khu vườn dành riêng cho bạn.
            </p>
            <button className="btn-start" onClick={handleStart}>
              <span>Khám phá khu vườn</span>
              <span>🌸</span>
            </button>
          </motion.section>
        ) : (
          <motion.section
            key="garden"
            className="garden-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="greeting-card">
              <span className="greeting-date">20 . 10 . 2026</span>
              <h1 className="greeting-title">
                Chúc mừng ngày
                <br />
                Phụ nữ Việt Nam
              </h1>
              <p className="greeting-text">
                {recipient
                  ? `Dành riêng cho ${recipient} — Một bức thư chân thành và khu vườn hoa hồng ngập tràn yêu thương.`
                  : 'Một bức thư chúc mừng chân thành từ trái tim, gửi tặng đến những người phụ nữ tuyệt vời nhất.'}
              </p>
              <p className="greeting-en">Happy Vietnamese Women’s Day</p>

              <div className="card-actions">
                <button className="btn-action-primary" onClick={handleOpenLetter}>
                  <span>Mở thư</span>
                  <span>💌</span>
                </button>
                <button className="btn-action-secondary" onClick={() => setStarted(false)}>
                  <span>Quay lại từ đầu</span>
                  <span>↺</span>
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Bottom-Right Button when garden is active */}
      {started && !isLetterOpen && (
        <motion.button
          className="message-floating-btn"
          onClick={handleOpenLetter}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span>Mở thư 20/10</span>
          <span>💌</span>
        </motion.button>
      )}

      {/* Letter Modal Dialog */}
      <AnimatePresence>
        {isLetterOpen && (
          <div className="letter-overlay" onClick={() => setIsLetterOpen(false)}>
            <motion.aside
              className="letter-modal letter-paper"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 18 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <button
                className="letter-close-btn"
                onClick={() => setIsLetterOpen(false)}
                aria-label="Đóng thư"
              >
                ×
              </button>

              <div className="letter-header">
                <span className="letter-seal">🌸</span>
                <h2 className="letter-salutation">
                  {recipient ? `Gửi ${recipient} thân thương,` : LETTER.salutation}
                </h2>
              </div>

              <div className="letter-content">
                {LETTER.paragraphs.map((p, idx) => (
                  <p key={idx} className="letter-paragraph">
                    {p}
                  </p>
                ))}
              </div>

              <div className="letter-signoff">
                <p className="letter-closing-wish">{LETTER.closing}</p>
                <p className="letter-signature">{LETTER.signature}</p>
              </div>

              <div className="letter-actions">
                <button className="btn-letter-copy" onClick={handleCopyLetter}>
                  <span>📋 Sao chép bức thư</span>
                </button>
                <button
                  className="btn-action-secondary"
                  onClick={() => setIsLetterOpen(false)}
                >
                  <span>Đóng thư</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="toast-notice"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)

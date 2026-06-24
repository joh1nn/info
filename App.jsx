import { useState, useRef } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Preview from './components/Preview.jsx'
import { generateInfographic } from './api/claude.js'
import './App.css'

export default function App() {
  const [productImg, setProductImg] = useState(null)
  const [referenceImg, setReferenceImg] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    price: '',
    stats: ['', '', ''],
    extra: '',
  })
  const [style, setStyle] = useState('ai-auto')
  const [lang, setLang] = useState('uz')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [resultHTML, setResultHTML] = useState('')
  const [apiKey, setApiKey] = useState(localStorage.getItem('anthropic_key') || '')

  const handleGenerate = async () => {
    if (!apiKey) {
      setStatus('❌ Avval API kalitni kiriting (yuqori o\'ng burchak)')
      return
    }
    setLoading(true)
    setStatus('🤖 AI infografika yaratmoqda...')
    try {
      const html = await generateInfographic({
        productImg,
        referenceImg,
        formData,
        style,
        lang,
        apiKey,
        onStatus: setStatus,
      })
      setResultHTML(html)
      setStatus('✅ Tayyor! HTML yoki PNG sifatida yuklab oling.')
    } catch (err) {
      setStatus('❌ Xatolik: ' + err.message)
    }
    setLoading(false)
  }

  const handleApiKey = (key) => {
    setApiKey(key)
    localStorage.setItem('anthropic_key', key)
  }

  return (
    <div className="app-layout">
      <header className="topbar">
        <div className="topbar-left">
          <span className="logo">✦ AI Infografika Studio</span>
          <span className="logo-sub">Professional poster yaratuvchi</span>
        </div>
        <div className="topbar-right">
          <input
            type="password"
            placeholder="Anthropic API kalit (sk-ant-...)"
            value={apiKey}
            onChange={e => handleApiKey(e.target.value)}
            className="api-input"
          />
        </div>
      </header>

      <div className="main-area">
        <Sidebar
          productImg={productImg}
          setProductImg={setProductImg}
          referenceImg={referenceImg}
          setReferenceImg={setReferenceImg}
          formData={formData}
          setFormData={setFormData}
          style={style}
          setStyle={setStyle}
          lang={lang}
          setLang={setLang}
          loading={loading}
          onGenerate={handleGenerate}
        />
        <Preview
          resultHTML={resultHTML}
          status={status}
          loading={loading}
          formData={formData}
          onRegenerate={handleGenerate}
        />
      </div>
    </div>
  )
}

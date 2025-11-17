import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [detectedFormat, setDetectedFormat] = useState('')
  const [targetFormat, setTargetFormat] = useState('json')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const handleDetect = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to detect')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/api/detect`, inputText, {
        headers: { 'Content-Type': 'text/plain' }
      })

      if (response.data.success) {
        setDetectedFormat(response.data.detectedFormat)
        setError('')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to detect format')
    } finally {
      setLoading(false)
    }
  }

  const handleConvert = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to convert')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/api/convert`, {
        input: inputText,
        targetFormat: targetFormat
      })

      if (response.data.success) {
        setOutputText(response.data.converted)
        setDetectedFormat(response.data.sourceFormat)
        setError('')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to convert format')
      setOutputText('')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
    setDetectedFormat('')
    setError('')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
      alert('Copied to clipboard!')
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  const handleSwap = () => {
    setInputText(outputText)
    setOutputText('')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🔄 Format Converter</h1>
        <p>Convert between JSON, XML, and YAML formats instantly</p>
      </header>

      <main className="main-content">
        <div className="converter-container">
          <div className="input-section">
            <div className="section-header">
              <h2>Input</h2>
              {detectedFormat && (
                <span className="detected-badge">
                  Detected: {detectedFormat.toUpperCase()}
                </span>
              )}
            </div>
            <textarea
              className="text-area"
              placeholder="Paste your JSON, XML, or YAML here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="button-group">
              <button
                className="btn btn-secondary"
                onClick={handleDetect}
                disabled={loading || !inputText.trim()}
              >
                🔍 Detect Format
              </button>
              <button
                className="btn btn-danger"
                onClick={handleClear}
                disabled={loading}
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          <div className="middle-section">
            <div className="format-selector">
              <label htmlFor="targetFormat">Convert to:</label>
              <select
                id="targetFormat"
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="format-select"
              >
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="yaml">YAML</option>
              </select>
            </div>
            <button
              className="btn btn-primary btn-convert"
              onClick={handleConvert}
              disabled={loading || !inputText.trim()}
            >
              {loading ? '⏳ Converting...' : '➡️ Convert'}
            </button>
            {outputText && (
              <button
                className="btn btn-secondary btn-swap"
                onClick={handleSwap}
                disabled={loading}
              >
                🔄 Swap
              </button>
            )}
          </div>

          <div className="output-section">
            <div className="section-header">
              <h2>Output</h2>
              {outputText && (
                <button
                  className="btn btn-small"
                  onClick={handleCopy}
                >
                  📋 Copy
                </button>
              )}
            </div>
            <textarea
              className="text-area"
              placeholder="Converted output will appear here..."
              value={outputText}
              readOnly
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Made with ❤️ | Supports JSON, XML, and YAML</p>
      </footer>
    </div>
  )
}

export default App

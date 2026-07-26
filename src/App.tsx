import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState('')
  // 是否为 debug 构建（由 Rust 端 debug_assertions 决定）
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    // 仅在 Tauri 运行时可用；普通浏览器预览时忽略错误保持 false
    invoke<boolean>('is_dev_mode')
      .then(setIsDev)
      .catch(() => {})
  }, [])

  // 调用 Rust 端的 greet 命令
  async function greet() {
    const result = await invoke<string>('greet', { name })
    setGreeting(result)
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 24,
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 560,
      }}
    >
      <h1>Tauri + React + Vite</h1>
      <p>
        输入名字后点击按钮，前端会通过 <code>invoke</code> 调用 Rust 端的{' '}
        <code>greet</code> 命令。
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          greet()
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入你的名字"
          aria-label="名字"
          style={{ padding: '8px 12px', fontSize: 16, marginRight: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px', fontSize: 16 }}>
          Greet
        </button>
      </form>
      {greeting && <p style={{ fontSize: 18 }}>{greeting}</p>}

      {/* debug 构建时显示底部悬浮占位图标 */}
      {isDev && (
        <div
          aria-label="开发模式"
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999,
            padding: '8px 12px',
            borderRadius: 999,
            background: 'rgba(255, 87, 34, 0.92)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            userSelect: 'none',
          }}
        >
          DEV_MODE
        </div>
      )}
    </main>
  )
}

export default App

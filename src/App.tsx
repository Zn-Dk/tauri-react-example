import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState('')

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
    </main>
  )
}

export default App

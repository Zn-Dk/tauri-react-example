# Tauri + React + Vite Example

一个用 `create-vite` 脚手架并集成 [Tauri v2](https://tauri.app/) 的最小示例项目，演示前端通过 `invoke` 调用 Rust 端命令（Rust ↔ React 桥接）。

## 技术栈

- **前端**：React 19 + TypeScript + Vite 8
- **桌面端**：Tauri v2（Rust）
- **包管理**：pnpm

## 目录结构

```
tauri-react-example/
├── src/                  # React 前端源码
│   └── App.tsx           # 调用 greet 命令的示例组件
├── src-tauri/            # Tauri / Rust 端
│   ├── src/lib.rs        # greet 命令定义与注册
│   ├── Cargo.toml        # Rust 依赖
│   └── tauri.conf.json   # Tauri 配置（窗口、devUrl、frontendDist）
├── vite.config.ts        # 固定端口 5173 + Tauri 环境变量前缀
└── package.json
```

## 环境要求

- Node.js 与 pnpm
- [Rust](https://www.rust-lang.org/)（rustc / cargo）
- Tauri 系统依赖（仅桌面构建需要）：
  - **Debian/Ubuntu**：`libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`
  - **Fedora/RHEL 9+**：`webkit2gtk4.1-devel openssl-devel curl wget file libappindicator-gtk3-devel librsvg2-devel libxdo-devel`

> 注意：Tauri v2 需要 `webkit2gtk-4.1` API。**RHEL 8 系（如 TencentOS Server 3.x）仓库仅提供 `webkit2gtk3`（4.0 API），不满足要求**，因此无法在该类系统上编译桌面端。如需运行桌面端，请在 Ubuntu 22.04+ / Fedora 36+ / RHEL 9 等具备 4.1 API 的环境执行。

## 常用脚本

```bash
pnpm install        # 安装前端依赖
pnpm dev            # 仅启动前端开发服务器（浏览器预览，invoke 不可用）
pnpm build          # 构建前端到 dist/
pnpm tauri dev      # 启动 Tauri 桌面应用（热重载，需系统依赖）
pnpm tauri build    # 打包可执行文件 / 安装包（需系统依赖）
```

## 示例说明

- Rust 端在 `src-tauri/src/lib.rs` 定义了 `greet` 命令并通过 `invoke_handler` 注册：
  ```rust
  #[tauri::command]
  fn greet(name: &str) -> String {
      format!("Hello, {}! You've been greeted from Rust!", name)
  }
  ```
- 前端在 `src/App.tsx` 通过 `invoke('greet', { name })` 调用并展示结果。

> `invoke` 依赖 Tauri 运行时注入，仅在 `pnpm tauri dev` 启动的桌面窗口中可用；用 `pnpm dev` 在普通浏览器中打开时点击按钮会报错，属正常现象。

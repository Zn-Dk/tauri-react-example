# Tauri + React + Vite 模板

一个可直接复用的 Tauri v2 + React + Vite + TypeScript 模板，包含跨 Windows / Android 的 GitHub Actions 构建链路。

这个仓库的定位是**模板**，不是业务应用：保留最小的 Rust ↔ React `invoke` 示例和 CI/CD 基建，业务项目应通过 GitHub 的 **Use this template** 创建新仓库后独立演进。

## 技术栈

- **前端**：React 19 + TypeScript + Vite 8
- **桌面端**：Tauri v2（Rust）
- **包管理**：pnpm
- **自动构建**：GitHub Actions（Windows 安装包、Android arm64 debug/release APK）

## 使用模板创建项目

1. 在本仓库 GitHub 页面点击 **Use this template → Create a new repository**。
2. 在新仓库中按 `docs/template-guide.md` 完成项目改名。
3. 推送代码后，Windows 和 Android 构建 workflow 会自动运行；纯 Markdown / `docs/` 变更不会触发构建。
4. 在 Actions run 的 Artifacts 下载对应安装包。

## 新项目必须修改的配置

至少修改以下三项，避免应用身份和产物名称沿用模板：

| 文件 | 配置 | 示例 |
|---|---|---|
| `package.json` | `name` | `clip-pilot` |
| `src-tauri/tauri.conf.json` | `productName` / `identifier` / `app.windows[].title` | `ClipPilot` / `com.example.clip_pilot` |
| `index.html` | `<title>` | `ClipPilot` |

`identifier` 必须是唯一的反向域名格式，例如 `com.zndk.clip_pilot`；不要使用 `com.tauri.dev`，也不要让多个真实应用共用同一个 identifier。

## 目录结构

```
.
├── .github/workflows/       # Windows / Android 自动构建
├── docs/                    # CI/CD 与模板使用说明
├── src/                     # React 前端
│   └── App.tsx              # 最小 invoke + debug DEV_MODE 示例
├── src-tauri/               # Tauri / Rust 端
│   ├── src/lib.rs           # greet、is_dev_mode 命令
│   ├── Cargo.toml           # Rust 依赖
│   └── tauri.conf.json      # 应用身份、窗口和构建配置
├── package.json
└── vite.config.ts
```

## 常用命令

```bash
pnpm install        # 安装前端依赖
pnpm dev            # 浏览器预览 UI
pnpm build          # 类型检查 + Vite 构建
pnpm tauri dev      # 启动 Tauri 桌面开发窗口
pnpm tauri build    # 本机构建桌面安装包
```

> `invoke` 依赖 Tauri 运行时。普通浏览器执行 `pnpm dev` 时，`greet` 不会真正调用 Rust；这只适合预览 UI。

## 构建与发布说明

- `push` 到 `main` 自动触发 Windows / Android 构建；连续 push 时 `concurrency` 会取消旧 run，只保留最新 run。
- `workflow_dispatch` 是备用手动入口；Android 可选择 `all`、`debug` 或 `release`。
- Android workflow 只构建 arm64，并在 CI 内生成 `gen/android`，不需要提交该目录。
- 当前 release 是 demo 配置：复用 debug 签名，仅用于实机测试；正式分发前必须改成 GitHub Secrets 管理的正式 keystore。
- debug 构建会显示底部 `DEV_MODE` 标识，release 构建不会显示。

详细说明：

- `docs/template-guide.md`：创建新项目后的改名清单
- `docs/github-actions-windows.md`：Windows 构建原理与排错
- `docs/github-actions-android.md`：Android 构建、体积和签名
- `docs/ci-cd-strategy.md`：CI 自动构建、CD 人工发布的分离策略

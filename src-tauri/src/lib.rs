// 自定义命令：供前端通过 invoke('greet') 调用
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// 区分 debug/release 构建：debug 编译（--debug）时 debug_assertions 为 true
#[tauri::command]
fn is_dev_mode() -> bool {
    cfg!(debug_assertions)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    // 注册前端可调用的命令
    .invoke_handler(tauri::generate_handler![greet, is_dev_mode])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

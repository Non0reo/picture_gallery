use device_query::{DeviceEventsHandler, DeviceEvents};
use enigo::{
    Enigo, Settings, Mouse
};


use tauri::{Emitter, Listener, Manager};
use std::time::Duration;



// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}



#[tauri::command]
fn subscribe_to_mouse_events(app_handle: tauri::AppHandle) {
    // let event_handler = DeviceEventsHandler::new(Duration::from_millis(10))
    //     .expect("Could not initialize event loop");

    // let _guard = event_handler.on_key_down(|key| {
    //     println!("Down: {:#?}", key);
    // });

    // let _guard = event_handler.on_key_up(|key| {
    //     println!("Up: {:#?}", key);
    // });

    // loop {}
}

#[tauri::command]
fn mouse_pos() -> (i32, i32) {
    // let enigo = Mouse::new().unwrap();
    let enigo = Enigo::new(&Settings::default()).unwrap();
    

    // let cursor_location = enigo.location().unwrap();
    // cursor_location.into()
    let cursor_location = enigo.location().unwrap();
    cursor_location.into()
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // .setup(|app| {
        //     // app.listen("download-started", |event| {
        //     //     if let Ok(payload) = serde_json::from_str::<DownloadStarted>(&event.payload()) {
        //     //     println!("downloading {}", payload.url);
        //     //     }
        //     // });
        //     app.emit(event, payload)
        //     Ok(())
        // })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![mouse_pos])
        .invoke_handler(tauri::generate_handler![subscribe_to_mouse_events])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

extern crate device_query;
use device_query::{DeviceQuery, DeviceState, MouseState};
use tauri::{ipc::CapabilityBuilder, Manager, Url};
use tauri::{WebviewUrl, WebviewWindowBuilder};

// use enigo::{ Enigo, Settings, Mouse };

// use tauri::{Emitter, Listener, Manager};
// use std::time::Duration;
// use std::thread;

// #[tauri::command]
// fn subscribe_to_mouse_events(app_handle: tauri::AppHandle) {
//     let event_handler = DeviceEventsHandler::new(Duration::from_millis(10))
//         .expect("Could not initialize event loop");

//     // Register callbacks for various events
//     // The callbacks will be automatically deregistered when they go out of scope
//     let _mouse_move_guard = event_handler.on_mouse_move(|position: &MousePosition| {
//         println!("Mouse moved to position: {:?}", position);
//     });

//     let _guard = event_handler.on_key_down(|key| {
//         println!("Down: {:#?}", key);
//     });

//     let _guard = event_handler.on_key_up(|key| {
//         println!("Up: {:#?}", key);
//     });

//     loop {
//         thread::sleep(Duration::from_secs(1000));
//     }
// }

#[tauri::command]
fn poll_mouse() -> ((i32, i32), bool) {
    let device_state = DeviceState::new();
    // let mut prev_mouse = MouseState::default();

    let mouse: MouseState = device_state.get_mouse();

    let outdat: ((i32, i32), bool) = (mouse.coords, mouse.button_pressed[1]);
    return outdat.into();
}

// #[tauri::command]
// fn mouse_pos() -> (i32, i32) {
//     // let enigo = Mouse::new().unwrap();
//     let enigo = Enigo::new(&Settings::default()).unwrap();

//     // let cursor_location = enigo.location().unwrap();
//     // cursor_location.into()
//     let cursor_location = enigo.location().unwrap();
//     cursor_location.into()
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let port: u16 = 1420;

    tauri::Builder::default()
        .plugin(tauri_plugin_localhost::Builder::new(port).build())
        .setup(move |app| {
            // In `tauri dev` mode you usually use your dev server.
            #[cfg(dev)]
            let url = WebviewUrl::App(std::path::PathBuf::from("/"));

            #[cfg(not(dev))]
            let url = {
                let url: Url = format!("http://localhost:{}", port).parse().unwrap();

                app.add_capability(
                    CapabilityBuilder::new("localhost")
                        .remote(url.to_string())
                        .window("helloworld"),
                )?;

                WebviewUrl::External(url)
            };

            // This requires you to remove the window from tauri.conf.json
            WebviewWindowBuilder::new(app, "helloworld".to_string(), url)
                .title("Localhost Example")
                .build()?;

            Ok(())
        })

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
        // .invoke_handler(tauri::generate_handler![mouse_pos])
        .invoke_handler(tauri::generate_handler![poll_mouse])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // loop {
    //     thread::sleep(Duration::from_secs(1000));
    // }
}

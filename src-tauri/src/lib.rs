extern crate device_query;
use device_query::{DeviceQuery, DeviceState, MouseState};
use tauri::{Manager, Url, ipc::CapabilityBuilder};
use tauri::{WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

use local_ip_address::local_ip;

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

#[tauri::command]
fn get_local_ip() -> String {
    let local_ip = local_ip().expect("Could not find the local IP Address");
    let host = local_ip.to_string();
    return host.into();
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
    // let host: &str = "192.168.68.13";
    // let host: &str = "127.0.0.1";
    // let host: &str = "localhost";

    // let local_ip = local_ip().expect("Could not find the local IP Address");
    // let host = local_ip.to_string();
    let host = get_local_ip();

    // let local_ip_string = local_ip.to_string();
    // let local_ip_string = if let Ok(local_ip) = local_ip { local_ip.to_string() } else { "localhost" };
    // let host: &str = if let Ok(local_ip) = local_ip { local_ip.to_string().as_str() } else { "localhost" };
    // let host = local_ip_string.as_str();


    // let local_ip_string = match local_ip() {
    //     Ok(ip) => ip.to_string(),
    //     Err(err) => "localhost".to_string(),
    // };
    // let host = local_ip_string.as_str().clone();


    let port: u16 = 1420;

    println!("{}", host);

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_localhost::Builder::new(port)
                .host(&host)
                .build(),
        )
        .setup(move |app| {
            //     // In `tauri dev` mode you usually use your dev server.
            //     // #[cfg(dev)]
            //     // let url = WebviewUrl::App(std::path::PathBuf::from("/"));

            //     // #[cfg(not(dev))]
            //     // let url = {
            //     //     let url: Url = format!("http://{}:{}", host, port).parse().unwrap();

            //     //     app.add_capability(
            //     //         CapabilityBuilder::new(host)
            //     //             // .permission()
            //     //             .remote(url.to_string())
            //     //             .window("main"),
            //     //     )?;

            //     //     WebviewUrl::External(url)
            //     // };

            //     // #[cfg(not(dev))]
            //     app.add_capability(
            //         CapabilityBuilder::new(host)
            //             // .permission()
            //             .remote(url.to_string())
            //             .window("main"),
            //     )?;

            // let url: WebviewUrl = WebviewUrl::External(host.parse().unwrap());
            // WebviewWindowBuilder::new(app, "main".to_string(), url)
            //     .title("Localhost Example")
            //     .build()?;

            //"http://192.168.68.13:*"
            //"http://" + &host.clone() + ":" + port.to_string()

            // #[cfg(not(dev))]
            // let url = {
            //     let url: Url = format!("http://{}:{}", &host, port.to_string()).parse().unwrap();
            //     let _ = app.add_capability(include_str!("../capabilities/default.json").replace("http://192.168.0.0:*", url.as_str() ));

            //     // WebviewUrl::External(url)
            // };

            // let url = {
            //     let url: Url = format!("http://{}:{}", &host, port.to_string()).parse().unwrap();

            //     app.add_capability(
            //         // CapabilityBuilder::new(&host)
            //         //     // .permission()
            //         //     .remote(url.to_string())
            //         //     .window("main"),
            //         CapabilityBuilder::from( CapabilityBuilder:: )
            //     )?;

            //     WebviewUrl::External(url)
            // };

            // #[cfg(not(dev))]
            let url: Url = format!("http://{}:{}", &host, port.to_string()).parse().unwrap();
            let _ = app
                .add_capability(include_str!("../capabilities/default.json").replace("http://192.168.0.0:*", url.as_str() )); 

            println!("{url}");
            WebviewUrl::External(url);
            // app.add

            app.dialog()
                .message(&host)
                .kind(MessageDialogKind::Info)
                .title("Information")
                .blocking_show();

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        // .invoke_handler(tauri::generate_handler![mouse_pos])
        .invoke_handler(tauri::generate_handler![poll_mouse, get_local_ip])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // loop {
    //     thread::sleep(Duration::from_secs(1000));
    // }
}

use tauri_build::AppManifest;

const COMMANDS: &[&str] = &["poll_mouse", "get_local_ip_path"];

fn main() {
    // tauri_build::build();

    let attributes =
        tauri_build::Attributes::new()
            .capabilities_path_pattern("../capabilities/default.json")
            .app_manifest(AppManifest::new().commands(COMMANDS));

    tauri_build::try_build(attributes).expect("failed to run tauri-build");
    // tauri_build::try_build(attributes).unwrap();
}

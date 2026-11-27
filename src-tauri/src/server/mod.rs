use std::{sync::Mutex};

use actix_files::{NamedFile};
use actix_web::{HttpRequest, Result};
use actix_web::{App, HttpServer, Responder, get, middleware, post, web};
use tauri::{AppHandle};

struct TauriAppState {
    app: Mutex<AppHandle>,
}



// #[get("/")]
// pub async fn index() -> actix_web::Result<impl Files> {
//     println!("Displayed send site for new user");

//     // let mut index_file = File::open("../client/index.html").unwrap();
//     // let mut data = vec![];
//     // index_file.read_to_end(&mut data);

//     // let index_path = "./index.html";
//     // let contents = read_to_string(index_path)
//     //     .expect("Should have been able to read the file");

//     // println!("{}", contents);

//     // Ok(web::Html::new("<p>Hello, World!</p>"))

//     // let path: PathBuf = "./index.html".parse().unwrap();
//     let files = Files::new("../static", ".")
//         .show_files_listing()
//         .index_file("index.html")
//         .prefer_utf8(true);
//     Ok(files);
//     // Ok(web::Html::)
// }

#[get("/")]
async fn index(_req: HttpRequest) -> Result<NamedFile> {
    println!("Requested Index");
    Ok(NamedFile::open("index.html")?)
}


#[post("/api/send")]
pub async fn send_data() -> actix_web::Result<impl Responder> {
    let text = "hello world";
    println!("{}",text);

    Ok(text.to_string())
}


#[actix_web::main]
// pub async fn init() -> std::io::Result<()> {
pub async fn init(app: AppHandle) -> std::io::Result<()> {
    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app),
    });

    // let path = ("192.168.68.13", 1240);
    // let path = ("localhost", 4875);
    let path = ("0.0.0.0", 1425);
    let host = path.0;
    let port = path.1;
    println!("Starting server on: {host}:{port}");

    HttpServer::new(move || {
        App::new()
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            .service(index)
            // .route(
            //     "/",
            //     web::get()
            //         .service(
            //             Files::new("/static", ".")
            //                 // .show_files_listing()
            //                 .index_file("index.html")
            //                 .use_last_modified(true)
            //         )
            //         // .into()
            // )
            .service(send_data)
    })
    .bind(path)?
    .run()
    .await
}
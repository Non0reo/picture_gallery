// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


// use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
// mod server;

// use std::thread;

fn main() {
    picture_gallery_lib::run();

    // loop {}
}
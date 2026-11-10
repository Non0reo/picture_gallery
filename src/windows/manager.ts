import { Mouse } from "../types/app";
import CustomWindow from "./window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export default class WindowsManager {
  windows: CustomWindow[] = [];
  // private _globalMousePosition?: Mouse;
  
  // set mousePosition(value: [number, number]) {
  //   this._globalMousePosition = value;
  // }

  constructor(currentWebviewWindow: WebviewWindow) {
    this.windows.push( new CustomWindow({ webview: currentWebviewWindow }) )
  }

  addWindow() {
    const newId: string = 'view' + this.windows.length;
    this.windows.push( new CustomWindow({ id: newId }) )
  }

  removeAll() {
    this.windows.forEach(async window => window.webview.close())
    this.windows = [];
  }

  checkMouseIntersections(mouse?: Mouse | null) {
    // console.log(mouse)
    console.log(this.windows)
    if (mouse) this.windows.forEach(window => console.log(window.isMouseIntersecting(mouse)))
  }
}
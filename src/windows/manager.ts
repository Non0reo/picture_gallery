import CustomWindow from "./window";

export default class WindowsManager {
  windows: CustomWindow[] = [];
  private _globalMousePosition?: [number, number];
  
  set mousePosition(value: [number, number]) {
    this._globalMousePosition = value;
  }

  addWindow() {
    const newId: string = 'view' + this.windows.length;
    this.windows.push( new CustomWindow({ id: newId }) )
  }

  removeAll() {
    this.windows.forEach(async window => window.webview.close())
    this.windows = [];
  }
}
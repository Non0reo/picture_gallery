import CustomWindow from "./window";

export default class WindowsManager {
  windows: CustomWindow[] = [];

  addWindow() {
    const newId: string = 'view' + this.windows.length;
    this.windows.push( new CustomWindow({ id: newId }) )
  }

  removeAll() {
    this.windows.forEach(async window => window.webview.close())
    this.windows = [];
  }
}
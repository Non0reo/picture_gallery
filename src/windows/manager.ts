import { Mouse, WindowOptions } from "../types";
import { defaultMouse } from '../utils/values';
import CustomWindow from "./window";

export default class WindowsManager {
  windows: CustomWindow[] = [];
  mouse: Mouse = defaultMouse;
  
  private _grabbedWindow: CustomWindow | null = null;
  private _mainWindow?: CustomWindow;
  
  // set mouse(mouse: Partial<Mouse>) {
  //   Object.assign(this._mouse, mouse);

  //   // console.warn(this._mouse, mouse)
  // }



  get mainWindow() {
    const window = this._mainWindow ?? this.windows.at(0);
    if (!window) throw new ReferenceError('No "main" window were declared')
    return window;
  }

  setMainWindow(mainWebviewWindowOptions: Omit<Required<WindowOptions>, 'id'>) {
    this.windows.push( this._mainWindow = new CustomWindow( mainWebviewWindowOptions ) )
  }

  addWindow() {
    const newId: string = 'view' + this.windows.length;
    this.windows.push( new CustomWindow({ id: newId }) )
  }

  removeAll() {
    this.windows.forEach(async window => window.webview.close())
    this.windows = [];
  }

  /**
   * Used to know if the window manaker should start or stop registering
   * mouse movement to move the selected window
   * @param pressed
   * @returns 
   */
  checkMouseIntersections(pressed: boolean) {
    // console.log(mouse)
    // console.log(this.windows)
    // if (mouse) this.windows.forEach(window => console.log(window.isMouseIntersecting(mouse)))

    if (pressed) {
      // if (!this.mouse.x || !this.mouse.y) return;

      console.log(pressed)

      const window = this.windows.find(window => window.movable && window.isMouseIntersecting(this.mouse));

      if (window) {
        this._grabbedWindow = window;
        window.grabbed = true;
        console.log(window)
      }
    }
    else {
      this._grabbedWindow = null;
    }

  }

  onMouseMove(/* delta: {x: } */) {
    if (!this._grabbedWindow) return;

    console.log(this.mouse)
    this._grabbedWindow.position = this.mouse
  }


}
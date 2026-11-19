import './styles.css';

import { availableMonitors, PhysicalPosition, PhysicalSize } from '@tauri-apps/api/window';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { invoke } from '@tauri-apps/api/core';
import { createTimer, Timer } from 'animejs';

import { defaultMouse } from './utils/values';
import { WindowsManager } from './windows';
import { ThreeEngine } from './three'
import { Mouse } from './types';


const monitors = await availableMonitors();
const mainDisplay = monitors[0];


//@ts-ignore The class auto execute at statup. C'est de la magie omg
class PictureGaleryApp {
  
  windowManager: WindowsManager = new WindowsManager();
  timer?: Timer;
  mouse: Mouse ; //Acually a Proxy object

  // private _isLeftPressed = false;
  private _threeEngine = new ThreeEngine();
  private _mainWindow = getCurrentWebviewWindow();
  private _startupSize = 1; //It don't work with 0
    
  static { new PictureGaleryApp() }

  constructor() {

    this.mouse = new Proxy<Mouse>(defaultMouse, {
      set: (mouse: any, prop: keyof Mouse, value, receiver) => {
        // console.log(mouse, prop, value, receiver);

        const hasChanged = value !== mouse[prop];
        // mouse[prop] = value;
        

        if (hasChanged) {
          (this.windowManager.mouse as any)[prop] = value;

          if (prop === 'left') 
            this.windowManager.checkMouseIntersections(value);

          else
            this.windowManager.onMouseMove();

          // else if (prop === 'x')  {
          //   const delta = value - mouse[prop];
          //   console.log(delta)
          // }

          mouse[prop] = value;
        }
        else {
          mouse[prop] = value;
        }

        return true;
      }
    });


    this._startup()
      .then(() => {

        // setTimeout(() => {
        //   //This mainWindow uses the CustomWindow object used for animations
        //   this.windowManager.mainWindow.centerSize = {
        //     width: 400,
        //     height: 400,
        //     ease: 'inOutQuint'
        //   }
        // }, 1000);

        this.windowManager.mainWindow.centerSize = {
          width: 400,
          height: 400,
          ease: 'inOutQuint',
          duration: 1
        }

      });
  }


  /**
   * Executed at startup when this class is created.
   * Used to center the main window for the loading animation before the rest
   * of the experience.
   */
  private async _startup() {

    const pPosition = new PhysicalPosition(
      mainDisplay.size.width / 2 - this._startupSize,
      mainDisplay.size.height / 2 - this._startupSize
    );
    const pSize = new PhysicalSize(
      this._startupSize * 2,
      this._startupSize * 2
    );
    const { x, y } = pPosition;
    const { width, height } = pSize;
    

    await this._mainWindow.setPosition(pPosition)
    await this._mainWindow.setSize(pSize)

    await this._mainWindow.show();
    await this._mainWindow.setFocus();
    // await this._mainWindow.setAlwaysOnTop(false)

    

    // this.mouse.x = 43;
    // console.log(this.mouse)
    

    //Declare the main window as a CustomWindow in the manager
    this.windowManager.setMainWindow({
      webview: this._mainWindow,
      x, y, width, height
    });


    this._initEvents();
    this.timer = createTimer({
      onUpdate: self => this._onUpdate(self),
      frameRate: 60,
    });    
  }


  /**
   * Init Events
   */
  private _initEvents() {
    const addWindowButton = document.querySelector('.addWindow') as HTMLButtonElement;
    const closeWindowsButton = document.querySelector('.closeAll') as HTMLButtonElement;
    const shrink = document.querySelector('.shrink') as HTMLButtonElement;

    addWindowButton?.addEventListener('click', () => {
      this.windowManager?.addWindow()
    })


    closeWindowsButton?.addEventListener('click', () => {
      this.windowManager?.removeAll()
    });
    
    shrink?.addEventListener('click', () => this.windowManager?.windows.forEach(win => {
      setTimeout(() => win.centerSize = [100, 100], 1000)
      setTimeout(() => win.centerSize = [400, 300], 2000)
    }))
  }


  /**
   * Internal global updater
   * @param _timer 
   */
  private _onUpdate(_timer: Timer) {
    // console.log('hello')

    invoke('poll_mouse').then(value => {
      const [pos, left] = value as [[number, number], boolean];
      this.mouse.x = pos[0];
      this.mouse.y = pos[1];
      this.mouse.left = left; 
    });

    this.windowManager.windows.forEach(win => win.update())

    // if (this._isLeftPressed)

    // console.log(this.windowManager)
    // this.windowManager?.checkMouseIntersections(this.mouse)
    this._threeEngine.render();
  }


}

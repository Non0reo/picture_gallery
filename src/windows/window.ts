import { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { AnimatableObject, AnimatableParams, createAnimatable, spring, utils } from "animejs";
import { Mouse, WindowOptions } from "../types";
import { arrayForm, Input, Position, Size } from '../utils/values'
import { TauriEvent } from "@tauri-apps/api/event";

export default class CustomWindow {
  webview: WebviewWindow;
  movable: boolean = true;
  grabbed: boolean = false;

  private _size: PhysicalSize;
  private _position: PhysicalPosition;
  private _posAnimatable: AnimatableObject;
  private _sizeAanimatable: AnimatableObject;

  private _defaultOptions: Omit<WindowOptions, 'id'> = {
    x: 100,
    y: 100,
    width: 300,
    height: 200,
  }

  /** Animate the position of this {@link CustomWindow} */
  set position(options: Input<Position>) {
    const [ duration, ease, x, y ] = arrayForm(options);
    this._posAnimatable.x(x, duration, ease)
    this._posAnimatable.y(y, duration, ease)
  }

  /** Animate the size of this {@link CustomWindow} */
  set size(options: Input<Size>) {
    const [ duration, ease, width, height ] = arrayForm(options);
    this._sizeAanimatable.width(width, duration, ease)
    this._sizeAanimatable.height(height, duration, ease)
  }

  /** Animate the position of this {@link CustomWindow} to its center */
  set center(options: Input<Position>) {
    const [ duration, ease, x, y ] = arrayForm(options);
    const { width, height } = this.size;
    this.position = {
      x: x - width / 2,
      y: y - height / 2,
      duration,
      ease
    }
  }
  
  /** Animate the size of this {@link CustomWindow} acording to the center of the window */
  set centerSize(options: Input<Size>) {
    const [ duration, ease, newWidth, newHeight ] = arrayForm(options);
    this.size = options;
    this.position = {
      x: this.position.x + (this.size.width - newWidth) / 2,  
      y: this.position.y + (this.size.height - newHeight) / 2,
      duration,
      ease
    }
  }

  /** Get the size of this {@link CustomWindow} */
  get size(): PhysicalSize { return this._size; }

  /** Get the position of this {@link CustomWindow} */
  get position(): PhysicalPosition { return this._position; }

  get center() {
    return {
      x: this.position.x + this.size.width / 2,
      y: this.position.y + this.size.height / 2,
    }
  }


  constructor(options: Partial<WindowOptions>) {
    const { id, width, height, x, y, webview } = Object.assign({}, this._defaultOptions, options);

    this._size = new PhysicalSize(width, height);
    this._position = new PhysicalPosition(x, y);

    if (!webview) {
      this.webview = new WebviewWindow('view' + id, {
        // url: 'https://example.org/',
        url: window.location.href,
        decorations: false,
        width,
        height,
        x,
        y
      });
    }
    else {
      this.webview = webview;
      this._onCreation(); //Trigger the creation as the windowWebview is technicaly created
    }

    this.webview.once(TauriEvent.WINDOW_CREATED, this._onCreation.bind(this));
    // this.webview.listen(TauriEvent.WINDOW_MOVED, this._onMove.bind(this));
    this.webview.once('tauri://error', this._onError.bind(this));

    const commonAnimatableParams: AnimatableParams = {
      modifier: v => +v.toFixed(0),
      ease: 'outExpo'
      // ease: spring({ bounce: 0.5, duration: 400 }),
      
      // onBegin(self) {
      //   self.fps = 30
      // },
    };

    this._posAnimatable = createAnimatable(this._position, {
      x: 1000,
      y: 1000,
      ...commonAnimatableParams,
      // onRender: async _ => await this._updatePosition()
    });

    this._sizeAanimatable = createAnimatable(this._size, {
      width: 1000,
      height: 1000,
      ...commonAnimatableParams,
      // onRender: async _ => await this._updateSize()
    });
  }

  isMouseIntersecting(mouse: Pick<Mouse, 'x' | 'y'>): boolean {
    // console.log(mouse)
    // console.log(this.position.x, mouse.x, this.position.x <= mouse.x)

    return this._position.x <= mouse.x && mouse.x <= this._position.x + this._size.width
        && this._position.y <= mouse.y && mouse.y <= this._position.y + this._size.height
  }


  update(size: boolean = true, pos: boolean = true) {
    pos && this._updatePosition();
    size && this._updateSize();
  }

  private _updateSize() {
    // console.log(this._size)
    this.webview.setSize(this._size)
  }

  private _updatePosition() {
    // console.log(this._position)
    this.webview.setPosition(this._position)
  }

  // private async _updateSize() {
  //   // console.log(this._size)
  //   await this.webview.setSize(this._size)
  // }

  // private async _updatePosition() {
  //   // console.log(this._position)
  //   await this.webview.setPosition(this._position)
  // }

  private _onCreation() {

    // setTimeout(() => {
    //   // this._posAnimatable.x(1500)
    //   // this._posAnimatable.y(600)
    //   // this._sizeAanimatable.width(100)
    //   // this._sizeAanimatable.height(100)

    //   // this.size = {width: 100, height: 100}
    //   // this.size = [100, 100]
    //   this.centerSize = [150, 150]

      
    // }, 3000)

    // setTimeout(() => {
    //   const { x, y } = this.position;
    //   this._posAnimatable.x(x - 200)
    //   this._posAnimatable.y(y - 150)
    //   this._sizeAanimatable.width(400)
    //   this._sizeAanimatable.height(300)
    // }, 6000);


    // setInterval(() => {
      
    //   this._posAnimatable.x(utils.random(1000))
    //   this._posAnimatable.y(utils.random(600))
    //   this._sizeAanimatable.width(utils.random(500))
    //   this._sizeAanimatable.height(utils.random(500))
    // }, 1000)
  }

  

  private _onError(_e: unknown) {

  }

  onDrag(mouse: Mouse) {
    this.center = {...mouse};
  }
}
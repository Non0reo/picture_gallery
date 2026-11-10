import { LogicalPosition, LogicalSize } from "@tauri-apps/api/dpi";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { AnimatableObject, AnimatableParams, createAnimatable, spring, utils } from "animejs";
import { Mouse } from "../types/app";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  webview?: WebviewWindow;
}

type WindowOptions = {
  id: string;
} & Rect

export default class CustomWindow {
  webview: WebviewWindow;

  size: LogicalSize;
  position: LogicalPosition;
  private _posAnimatable: AnimatableObject;
  private _sizeAanimatable: AnimatableObject;

  private _defaultOptions: Omit<WindowOptions, 'id'> = {
    x: 100,
    y: 100,
    width: 300,
    height: 200,
  }

  constructor(options: Partial<WindowOptions>) {
    const { id, width, height, x, y, webview } = Object.assign({}, this._defaultOptions, options);

    this.size = new LogicalSize(width, height);
    this.position = new LogicalPosition(x, y);

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

      this.webview.once('tauri://created', this._onCreation.bind(this));
      this.webview.once('tauri://error', this._onError.bind(this));
    }
    else this.webview = webview;

    const commonAnimatableParams: AnimatableParams = {
      x: 1000,
      y: 1000,
      width: 1000,
      height: 1000,
      ease: 'inOutQuint',
      // ease: spring({ bounce: 0.5, duration: 400 }),
      modifier: v => +v.toFixed(0),
    };

    this._posAnimatable = createAnimatable(this.position, {
      ...commonAnimatableParams,
      onRender: async _ => await this._updatePosition()
    });

    this._sizeAanimatable = createAnimatable(this.size, {
      ...commonAnimatableParams,
      onRender: async _ => await this._updateSize()
    });
  }

  isMouseIntersecting(mouse: Mouse): boolean {
    console.log(mouse)
    return this.position.x <= mouse.x && mouse.x <= this.position.x + this.size.width
        && this.position.y <= mouse.y && mouse.y <= this.position.y + this.size.height
  }

  private async _updateSize() {
    await this.webview.setSize(this.size)
  }

  private async _updatePosition() {
    await this.webview.setPosition(this.position)
  }

  private _onCreation() {
    // setTimeout(() => {
    //   this._posAnimatable.x(1500)
    //   this._posAnimatable.y(600)
    //   this._sizeAanimatable.width(0)
    //   this._sizeAanimatable.height(0)
      
    // }, 3000)

    // setTimeout(() => {
    //   const { x, y } = this.position;
    //   this._posAnimatable.x(x - 200)
    //   this._posAnimatable.y(y - 150)
    //   this._sizeAanimatable.width(400)
    //   this._sizeAanimatable.height(300)
    // }, 6000);

    setInterval(() => {
      this._posAnimatable.x(utils.random(1000))
      this._posAnimatable.y(utils.random(600))
      this._sizeAanimatable.width(utils.random(500))
      this._sizeAanimatable.height(utils.random(500))
    }, 1000)
  }

  private _onError(_e: unknown) {

  }
}
import { LogicalPosition, LogicalSize } from "@tauri-apps/api/dpi";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { AnimatableObject, createAnimatable, utils } from "animejs";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
}

type WindowOptions = {
  id: string;
} & Rect

export default class CustomWindow {
  webview: WebviewWindow;

  size: LogicalSize;
  position: LogicalPosition;
  private _animatable: AnimatableObject;

  private _defaultOptions: Omit<WindowOptions, 'id'> = {
    x: 100,
    y: 100,
    width: 300,
    height: 200,
  }

  set rect(value: Partial<Rect>) {
    Object.assign(this.size, value)
    Object.assign(this.position, value)
  }

  get rect(): Rect {
    const { x, y } = this.position;
    const { width, height } = this.size;

    return { x, y, width, height };
  }

  constructor(options: Partial<WindowOptions>) {
    const { id, width, height, x, y } = Object.assign({}, this._defaultOptions, options);
    this.size = new LogicalSize(width, height);
    this.position = new LogicalPosition(x, y)
    this.rect = { x, y, width, height }

    this.webview = new WebviewWindow('view' + id, {
      url: 'https://github.com/tauri-apps/tauri',
      width: 300,
      height: 200,
      decorations: false,
    });

    this.webview.once('tauri://created', this._onCreation);
    this.webview.once('tauri://error', this._onError);

    this._animatable = createAnimatable(this.rect, {
      x: 1000,
      y: 1000,
      width: 1000,
      height: 1000,
      ease: 'out',
      modifier: v => +v.toFixed(0),
      onRender: async _ => {
        this.rect = {
          x: this._animatable.x() as number,
          y: this._animatable.y() as number,
          width: this._animatable.width() as number,
          height: this._animatable.height() as number,
        }

        this._updateSize();
        this._updatePosition();
      }
    });

    setInterval(() => {
      this._animatable.x(utils.random(1500))
      this._animatable.y(utils.random(600))
      this._animatable.width(utils.random(100, 500))
      this._animatable.height(utils.random(100, 500))
      
    }, 2000)
  }

  private async _updateSize() {
    await this.webview.setSize(this.size)
  }

  private async _updatePosition() {
    await this.webview.setPosition(this.position)
  }

  private _onCreation() {

  }

  private _onError(_e: unknown) {

  }
}
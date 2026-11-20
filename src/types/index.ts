import type { WebviewWindow } from "@tauri-apps/api/webviewWindow";

type Mouse = {
  x: number,
  y: number,
  left: boolean
}

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
}

type WindowOptions = {
  id: string;
  movable?: boolean;
  webview?: WebviewWindow;
} & Rect

export type {
  Mouse,

  WindowOptions,
  Rect
}
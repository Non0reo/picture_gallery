import { availableMonitors } from "@tauri-apps/api/window";
import { Position } from "./values";

const monitors = await availableMonitors();
const mainMonitor = monitors[0];

const positionUV = (position: Position) => {
  const { width, height } = mainMonitor.size;
  return {
    x: position.x / width,
    y: position.y / height
  }
}

export default mainMonitor;
export {
  positionUV,
  mainMonitor
}
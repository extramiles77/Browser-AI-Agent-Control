/**
 * Browser control for the background: a thin `chrome.debugger` relay for the Browser AI Agent Control daemon (`@browser-ai-agent/mcp`). The popup's side is `@browser-ai-agent/extension-core/popup`
 */
export { addBrowserControl } from "./background";
export {
  BrowserControl,
  type BrowserControlEvent,
  type BrowserControlOptions,
  PAUSED_MESSAGE,
} from "./background/browser-control";
export {
  type BrowserControlMessages,
  handleBrowserControlMessages,
  requirePopupSender,
} from "./messages";
export * from "./browser-label";
export * from "./types";

/** Messages for the model (and the user reading along) about the browser connection, kept together so the engine and the relay word things the same way. `NO_EXTENSION_MESSAGE` and `pairingRequiredMessage()` are in `@browser-ai-agent/protocol`, shared with the extension */

const HOME_PAGE = "https://github.com/extramiles77/Browser-AI-Agent-Control";

export const PAUSED_MESSAGE =
  "The user paused Browser AI Agent Control. Ask them to click Resume in its popup";

export const UPDATE_EXTENSION_MESSAGE = `The Browser AI Agent Control extension is outdated. Update it: build the latest source (pnpm install, pnpm build), open chrome://extensions, turn on Developer mode and click Update, then accept the new permission Chrome asks for. Steps: ${HOME_PAGE}`;

export const UPDATE_SERVER_MESSAGE = `The Browser AI Agent Control extension is newer than this server. Build the latest source (git pull, pnpm install, pnpm build) and restart the AI app. Steps: ${HOME_PAGE}`;

/** A tab or browser named by an agent belongs to a browser (profile) that isn't connected now */
export function browserDisconnectedMessage(label: string): string {
  return `${label} disconnected from Browser AI Agent Control. It reconnects by itself while it's open; meanwhile use a tab of another browser (\`tab list\`, \`browser list\`)`;
}

export function noSuchBrowserMessage(name: string): string {
  return `There's no browser ${JSON.stringify(name)}. Run \`browser list\``;
}

export function ambiguousBrowserMessage(name: string, ids: string[]): string {
  return `Several browsers are named ${JSON.stringify(name)}: use an ID (${ids.join(", ")}) from \`browser list\``;
}

/** The reason `anotherBrowser` closes a browser with, when `MAX_BROWSERS` are connected */
export function tooManyBrowsersReason(max: number): string {
  return `Browser AI Agent Control is connected to ${max} browsers already`;
}

export function rejectedExtensionMessage(extensionId: string): string {
  return `The extension ${extensionId} tried to connect but isn't allowed. If it's a development build, add its ID to BROWSER_AI_AGENT_EXTENSION_IDS (comma-separated) in the AI app's MCP config for @browser-ai-agent/mcp and restart the AI app or reconnect the MCP server`;
}

export const TAB_DETACHED_MESSAGE =
  "The tab detached from the debugger before it was ready, so Browser AI Agent Control let it go. Another extension on the page may keep putting its frame back. Try again, or use another tab";

/** `browser`: the tab's browser's label, while several are connected */
export function noSuchTabMessage(tabId: number, browser?: string): string {
  return `There's no tab ${tabId} in ${browser ?? "the connected browser"}. Run \`tab list\``;
}

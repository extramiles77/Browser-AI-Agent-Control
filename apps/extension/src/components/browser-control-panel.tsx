import { useState } from "react";

import {
  KeyRoundIcon,
  PauseIcon,
  PlayIcon,
  PlugZapIcon,
  RefreshCwIcon,
  UnplugIcon,
} from "lucide-react";

import {
  type ConnectionStatus,
  sendBrowserControlMessage,
  TAB_GROUP_HEX,
  TAB_GROUP_TEXT,
  useBrowserControl,
} from "@browser-ai-agent/extension-core/popup";

import { APP_NAME, UPDATE_EXTENSION_URL, UPDATE_SERVER_URL } from "./links";
import { Alert, Button, ErrorAlert, openPage } from "./ui";

/**
 * The popup's browser control: the connection to the Browser AI Agent Control server (or what to update), **Allow** for a new server, the AI apps using the browser with their tabs, and **Stop** / **Resume**
 */
export function BrowserControlPanel() {
  const [view, refresh] = useBrowserControl();
  const [error, setError] = useState<string | null>(null);

  if (!view) {
    return null;
  }

  const run = (action: () => Promise<void>) => async () => {
    setError(null);
    try {
      await action();
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
    await refresh();
  };

  const { connection } = view;
  const paired =
    connection.state === "connected" && connection.pairing === "paired";

  return (
    <div className="flex flex-col">
      {error && (
        <div className="px-4 pt-3">
          <ErrorAlert>{error}</ErrorAlert>
        </div>
      )}
      <ConnectionAlert
        connection={connection}
        legacyServer={view.legacyServer}
        onAllow={(publicKey) =>
          run(() => sendBrowserControlMessage("allowDaemon", { publicKey }))()
        }
        onDisconnect={run(() => sendBrowserControlMessage("disconnect"))}
        onConnect={run(() => sendBrowserControlMessage("pair"))}
      />

      {paired && (
        <section
          aria-labelledby="browser-control-apps"
          className="space-y-3 px-4 py-3"
        >
          <h2
            id="browser-control-apps"
            className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
          >
            AI apps
          </h2>
          {view.apps.length === 0 ? (
            <p className="text-muted-foreground">
              No AI apps are using this browser.
            </p>
          ) : (
            <ul className="space-y-3">
              {view.apps.map((app) => (
                <li key={app.id}>
                  {/* The app's tab group as Chrome draws it: its name on its color, and a line in that color by its tabs */}
                  <span
                    className="inline-block max-w-full truncate rounded-md px-1.5 py-px text-xs font-medium"
                    style={{
                      backgroundColor: TAB_GROUP_HEX[app.color],
                      color: TAB_GROUP_TEXT[app.color],
                    }}
                  >
                    {app.name}
                  </span>
                  <ul
                    className="ms-1 mt-1 border-s-2 ps-1"
                    style={{ borderColor: TAB_GROUP_HEX[app.color] }}
                  >
                    {app.tabs.map((tab) => (
                      <li key={tab.tabId}>
                        <button
                          type="button"
                          title={tab.url}
                          className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-start outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                          onClick={run(() =>
                            sendBrowserControlMessage("switchToTab", {
                              tabId: tab.tabId,
                            }),
                          )}
                        >
                          <span className="min-w-0 flex-1 truncate">
                            {tab.title}
                          </span>
                          {tab.attached && (
                            <span className="shrink-0 text-xs text-muted-foreground">
                              In use
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Stop and Resume only once a server is connected and allowed: before that there are no agents to stop, and a Resume left from an earlier session reads as if the extension were connected. A pause from before carries over and shows Resume as soon as the server is allowed */}
      {paired ? (
        <div className="mt-3 space-y-2 border-t bg-muted/60 px-4 py-3">
          {view.paused && (
            <p className="text-muted-foreground">
              Agents are paused until you resume them.
            </p>
          )}
          {view.paused ? (
            <Button
              size="wide"
              onClick={run(() => sendBrowserControlMessage("resumeAgents"))}
            >
              <PlayIcon />
              Resume
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="wide"
              onClick={run(() => sendBrowserControlMessage("stopAgents"))}
            >
              <PauseIcon />
              Stop
            </Button>
          )}
          <DisconnectButton
            onDisconnect={run(() => sendBrowserControlMessage("disconnect"))}
          />
        </div>
      ) : (
        <div className="pb-3" />
      )}
    </div>
  );
}

/** **Disconnect**: closes the connection to the server and goes back to the screen for connecting (**Connect now**) */
function DisconnectButton({ onDisconnect }: { onDisconnect: () => void }) {
  return (
    <Button variant="outline" size="wide" onClick={onDisconnect}>
      <UnplugIcon />
      Disconnect
    </Button>
  );
}

/**
 * One of four states: connected (or waiting for **Allow**), disconnected by the user, waiting for the server, or an update to make. A 0.1.x server answering on its port counts as an outdated server
 */
function ConnectionAlert({
  connection,
  legacyServer,
  onAllow,
  onDisconnect,
  onConnect,
}: {
  connection: ConnectionStatus;
  legacyServer: boolean;
  onAllow: (publicKey: string) => void;
  onDisconnect: () => void;
  onConnect: () => void;
}) {
  if (connection.state === "disconnected") {
    return (
      <div
        role="alert"
        className="mx-4 mt-3 space-y-2.5 rounded-xl border bg-muted px-3 py-2.5"
      >
        <p className="flex items-center gap-2 font-medium">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-muted-foreground/50"
          />
          Disconnected from the {APP_NAME} server
        </p>
        <p className="ps-4 text-muted-foreground">
          Agents can't use this browser until you connect again.
        </p>
        <div className="ps-4">
          <ConnectButton />
        </div>
      </div>
    );
  }
  if (connection.state === "connected" && connection.pairing === "consent") {
    return (
      <ConsentAlert
        connection={connection}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />
    );
  }
  if (connection.state === "connected") {
    return connection.pairing === "pending" ? (
      <AllowAlert
        connection={connection}
        onAllow={onAllow}
        onDisconnect={onDisconnect}
      />
    ) : (
      <>
        {legacyServer && <UpdateAlert kind="server" />}
        <div className="px-4 pt-3">
          <p className="flex items-center gap-2.5 rounded-xl border border-success/25 bg-success-soft px-3 py-2.5 font-medium">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-success ring-4 ring-success/20"
            />
            Connected to the {APP_NAME} server
          </p>
        </div>
      </>
    );
  }
  if (connection.state === "updateExtension") {
    return <UpdateAlert kind="extension" />;
  }
  if (connection.state === "updateServer" || legacyServer) {
    return <UpdateAlert kind="server" />;
  }
  // Searching, the server refused this browser (too many connected, or another one in use with servers before 2.4), or the program on the port couldn't be verified
  if (connection.state === "untrusted") {
    return (
      <div className="px-4 pt-3">
        <Alert
          variant="destructive"
          title={`Waiting for the ${APP_NAME} server`}
        >
          The program on its port couldn't prove it's the {APP_NAME} server.
          Restart your AI app, and if this stays, check what else runs on ports
          9010 to 9012.
        </Alert>
      </div>
    );
  }
  return (
    <div
      role="alert"
      className="mx-4 mt-3 space-y-1 rounded-xl border bg-muted px-3 py-2.5"
    >
      <p className="flex items-center gap-2 font-medium">
        <span
          aria-hidden
          className="size-2 shrink-0 animate-pulse rounded-full bg-primary/70 motion-reduce:animate-none"
        />
        Waiting for the {APP_NAME} server
      </p>
      {connection.state === "anotherBrowser" ? (
        <p className="ps-4 text-muted-foreground">
          Another browser is using {APP_NAME}, or too many are connected. This
          one connects once there's room.
        </p>
      ) : (
        <WaitingSteps />
      )}
    </div>
  );
}

/**
 * How the extension reaches the server, which it can't start itself (extensions can't run programs): an AI app with the MCP server starts it, or the user runs `pnpm daemon`. **Connect now** looks for it at once rather than after the next retry
 */
function WaitingSteps() {
  return (
    <div className="space-y-2.5 ps-4 text-muted-foreground">
      <p>The extension connects on its own once the server runs:</p>
      <ol className="list-decimal space-y-1 ps-4">
        <li>
          Open an AI app with the {APP_NAME} MCP server (restart it after adding
          the server), and ask it to open a page.
        </li>
        <li>
          Or start the server yourself: run{" "}
          <code className="rounded bg-background px-1 py-px font-mono text-[12px] text-foreground">
            pnpm daemon
          </code>{" "}
          in the repository folder.
        </li>
      </ol>
      <ConnectButton />
    </div>
  );
}

/** **Connect now**: undoes **Disconnect** and looks for the server at once rather than after the next retry */
function ConnectButton() {
  const [searching, setSearching] = useState(false);
  const connect = async () => {
    setSearching(true);
    try {
      await sendBrowserControlMessage("connect");
    } catch (error) {
      console.warn("Couldn't reach the background", error);
    }
    // The popup refreshes its view on its own; keep the button busy while the extension looks
    setTimeout(() => setSearching(false), 2500);
  };
  return (
    <Button size="wide" disabled={searching} onClick={() => void connect()}>
      {searching ? (
        <RefreshCwIcon className="animate-spin motion-reduce:animate-none" />
      ) : (
        <PlugZapIcon />
      )}
      {searching ? "Looking for the server…" : "Connect now"}
    </Button>
  );
}

/**
 * The first step with a server the user never allowed: whether to connect to it at all. Only **Connect** makes the code (the extension's nonce is sent then), which **Allow** follows
 */
function ConsentAlert({
  connection,
  onConnect,
  onDisconnect,
}: {
  connection: Extract<ConnectionStatus, { state: "connected" }>;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <section
      role="alert"
      aria-labelledby="browser-control-consent"
      className="mx-4 mt-3 space-y-3 rounded-xl border border-primary/20 bg-primary-soft p-3.5"
    >
      <div className="flex gap-2">
        <PlugZapIcon
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden
        />
        <div className="space-y-1">
          <h2 id="browser-control-consent" className="font-semibold">
            Connect to the {APP_NAME} server?
          </h2>
          <p className="text-muted-foreground">
            A server is running on this computer (port {connection.port},
            version {connection.daemonVersion}). Connect only if you use{" "}
            {APP_NAME} in an AI app. You'll then compare a code with the AI app
            and click Allow.
          </p>
        </div>
      </div>
      <Button size="wide" onClick={onConnect}>
        <PlugZapIcon />
        Connect
      </Button>
      <DisconnectButton onDisconnect={onDisconnect} />
    </section>
  );
}

function AllowAlert({
  connection,
  onAllow,
  onDisconnect,
}: {
  connection: Extract<ConnectionStatus, { state: "connected" }>;
  onAllow: (publicKey: string) => void;
  onDisconnect: () => void;
}) {
  return (
    <section
      role="alert"
      aria-labelledby="browser-control-allow"
      className="mx-4 mt-3 space-y-3 rounded-xl border border-primary/20 bg-primary-soft p-3.5"
    >
      <div className="flex gap-2">
        <KeyRoundIcon
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden
        />
        <div className="space-y-1">
          <h2 id="browser-control-allow" className="font-semibold">
            Allow {APP_NAME} on this computer?
          </h2>
          <p className="text-muted-foreground">
            Allow it only if you use {APP_NAME} in an AI app. The AI app shows
            the same code.
          </p>
        </div>
      </div>
      {connection.code && (
        <p className="rounded-lg border border-primary/15 bg-background py-2.5 text-center font-mono text-lg font-semibold tracking-wider text-primary">
          Code: {connection.code}
        </p>
      )}
      <Button size="wide" onClick={() => onAllow(connection.publicKey)}>
        Allow
      </Button>
      <DisconnectButton onDisconnect={onDisconnect} />
    </section>
  );
}

function UpdateAlert({ kind }: { kind: "server" | "extension" }) {
  return (
    <div className="px-4 pt-3">
      <Alert variant="destructive" title={`Update the ${APP_NAME} ${kind}`}>
        {kind === "server"
          ? "Get the latest source and build it again (git pull, pnpm install, pnpm build), then restart the AI app."
          : "Get the latest source and build it again, then click Reload for it in chrome://extensions."}
        <div className="mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              openPage(
                kind === "server" ? UPDATE_SERVER_URL : UPDATE_EXTENSION_URL,
              )
            }
          >
            How to update
          </Button>
        </div>
      </Alert>
    </div>
  );
}

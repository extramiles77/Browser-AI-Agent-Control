import { Command } from "commander";

import type { CreateCommandEngine } from "@/contracts";
import { DaemonAlreadyRunningError, startDaemon } from "@/daemon/daemon";
import { createFileLogger } from "@/daemon/log";
import { browserMcpHome, daemonLogPath, ensureHome } from "@/daemon/paths";

/** `--keep-alive`: the longest delay `setTimeout` takes (about 24.8 days); `Infinity` would fire at once */
const KEEP_ALIVE_IDLE_EXIT_MS = 2 ** 31 - 1;

/**
 * The daemon process's entry: `node dist/daemon.js [--port <port>] [--stderr] [--keep-alive]`, started detached by a thin process. Logs to `~/.browser-ai-agent-control/daemon.log` (and stderr with `--stderr`, for running it by hand). `--keep-alive` (`pnpm daemon`) skips the idle exit, so the extension can connect and be allowed before any AI app runs
 */
export async function runDaemon(options: {
  argv: string[];
  version: string;
  createEngine: CreateCommandEngine;
  idleExitMs?: number;
}) {
  const command = new Command()
    .name("browser-ai-agent-daemon")
    .option("--port <port>", "listen on this port only", (value) =>
      Number.parseInt(value, 10),
    )
    .option("--stderr", "also log to stderr")
    .option("--keep-alive", "don't exit when idle (for running it by hand)")
    .parse(options.argv);
  const { port, stderr, keepAlive } = command.opts<{
    port?: number;
    stderr?: boolean;
    keepAlive?: boolean;
  }>();

  const home = browserMcpHome();
  ensureHome(home);
  const log = createFileLogger(daemonLogPath(home, port), { echo: stderr });
  process.on("uncaughtException", (error) => log("Uncaught exception:", error));
  process.on("unhandledRejection", (error) =>
    log("Unhandled rejection:", error),
  );

  try {
    const daemon = await startDaemon({
      home,
      port,
      version: options.version,
      createEngine: options.createEngine,
      idleExitMs: keepAlive ? KEEP_ALIVE_IDLE_EXIT_MS : options.idleExitMs,
      log,
    });
    for (const signal of ["SIGINT", "SIGTERM"] as const) {
      process.on(signal, () => void daemon.stop(signal));
    }
    await daemon.stopped;
    process.exit(0);
  } catch (error) {
    if (error instanceof DaemonAlreadyRunningError) {
      log(error.message, "- exiting");
      process.exit(0);
    }
    log("The daemon couldn't start:", error);
    process.exit(1);
  }
}

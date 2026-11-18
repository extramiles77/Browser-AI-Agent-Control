/**
 * Copies the production build (`.output/chrome-mv3`) to `chrome-extension/` at the repository's root, the folder users load with **Load unpacked**, so it always matches the source. Run by `pnpm build` after `wxt build`; `chrome-extension/` is ignored by git
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

const from = path.resolve(import.meta.dirname, "../.output/chrome-mv3");
const to = path.resolve(import.meta.dirname, "../../../chrome-extension");

if (!existsSync(path.join(from, "manifest.json"))) {
  throw new Error(`No build in ${from}: run wxt build first`);
}
rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
console.log(`Synced the extension to ${path.relative(process.cwd(), to)}`);

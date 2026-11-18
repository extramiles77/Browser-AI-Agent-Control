import { HelpCircleIcon, SettingsIcon } from "lucide-react";

import logo from "@/assets/logo.svg";

import { APP_NAME, DOCS_URL } from "./links";
import { Button, openPage } from "./ui";

export function PopupHeader({
  onOpenSettings,
}: {
  onOpenSettings: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b bg-background px-4 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <img src={logo} alt="" width={32} height={32} className="shrink-0" />
        {/* The name as the wordmark writes it, "AI" in the logo's blue */}
        <span
          aria-label={APP_NAME}
          className="truncate text-[15px] leading-tight font-semibold tracking-[-0.02em]"
        >
          Browser <span className="text-primary">AI</span> Agent Control
        </span>
      </div>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          onClick={onOpenSettings}
        >
          <SettingsIcon className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Help"
          onClick={() => openPage(DOCS_URL)}
        >
          <HelpCircleIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}

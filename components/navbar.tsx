import {
  ArrowRight,
  MoonIcon,
  RefreshCcw,
  SunIcon,
  Trash,
  Undo,
} from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { useTheme } from "next-themes";
import { Session } from "@supabase/supabase-js";
import { DropdownMenu } from "./ui/dropdown-menu";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "./ui/avatar";

export function Navbar({
  session,
  showLogin,
  signOut,
  onClear,
  canClear,
  onSocialClick,
  onUndo,
  canUndo,
}: {
  session: Session | null;
  showLogin: () => void;
  signOut: () => void;
  onClear: () => void;
  canClear: boolean;
  onSocialClick: (target: "github" | "x" | "discord") => void;
  onUndo: () => void;
  canUndo: () => boolean;
}) {
  const { theme, setTheme } = useTheme();
  return (
    <nav className="w-full flex bg-background py-4">
      <div className="flex flex-1 items-center">
        <Link href={"/"} className="flex items-center gap-2">
          <RefreshCcw className="h-6 w-6 dark:text-white" />
          <h1 className="whitespace-pre">Tiny Chat</h1>
        </Link>
      </div>
      <div>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={onClear}
                disabled={!canClear}
              >
                <Trash className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                disabled={false}
              >
                {theme === "light" ? (
                  <SunIcon className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <MoonIcon className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {session ? (
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        session.user.user_metadata?.avatar_url ||
                        'https://avatar.vercel.sh/"' + session.user.email
                      }
                      alt={session.user.email}
                    />
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>My account</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenu>
        ) : (
          <Button variant={"default"} onClick={showLogin}>
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </nav>
  );
}

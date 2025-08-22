"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  PlusSquare,
  Library,
  FileUp,
  Settings,
  LogOut,
  BrainCircuit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BrainIcon } from "../shared/icons";

const navItems = [
  { href: "/decks", icon: BookOpen, label: "学习卡组" },
  { href: "/add-manual", icon: PlusSquare, label: "手动添加" },
  { href: "/add-system", icon: Library, label: "系统卡组" },
  { href: "/add-document", icon: FileUp, label: "文档导入" },
  { href: "/manage", icon: Settings, label: "管理卡组" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-card sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/decks"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <BrainCircuit className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">MediFlash</span>
        </Link>
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    pathname.startsWith(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
      <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground md:h-8 md:w-8">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`} alt={user?.username} />
                        <AvatarFallback>{user?.username?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
            </TooltipTrigger>
            <TooltipContent side="right">{user?.username}</TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 md:h-8 md:w-8" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right">退出登录</TooltipContent>
        </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}

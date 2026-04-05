"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  FolderOpen,
  Variable,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    title: "Criar Template",
    href: "/templates/novo",
    icon: FilePlus,
  },
  {
    title: "Documentos",
    href: "/documentos",
    icon: FolderOpen,
  },
  {
    title: "Variáveis",
    href: "/variaveis",
    icon: Variable,
  },
]

export function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-sidebar rounded-r-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border h-16 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/academy-2.png"
            alt="Bonsae"
            width={180}
            height={60}
            className="h-12 w-auto brightness-0 invert ml-9 mb-2"
          />
        </Link>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                "text-sidebar-foreground hover:bg-sidebar-accent",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary-foreground")} />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-medium text-sm">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Usuário Demo
            </p>
            <p className="text-xs text-sidebar-muted truncate">
              usuario@bonsae.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 border-r border-sidebar-border shrink-0 rounded-r-4xl shadow-sm bg-sidebar">
      <SidebarContent />
    </aside>
  )
}

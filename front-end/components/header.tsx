"use client"

import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
  onSearchChange?: (value: string) => void
  searchValue?: string
}

export function Header({ title, subtitle, onMenuClick, onSearchChange, searchValue }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-border bg-card shrink-0">
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="hidden lg:flex items-center gap-2">
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-9 w-48 xl:w-64 bg-muted/50"
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <ModeToggle />
      </div>
    </header>
  )
}

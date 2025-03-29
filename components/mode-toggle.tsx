"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "w-9 h-9 rounded-full relative overflow-hidden transition-all duration-300",
        "hover:bg-muted hover:scale-105",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        theme === "dark" ? "bg-muted/30" : "bg-background",
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>

      {/* Decorative elements */}
      <span className="absolute inset-0 rounded-full dark:bg-gradient-to-br dark:from-blue-950/30 dark:to-indigo-900/20 opacity-0 dark:opacity-100 transition-opacity duration-500"></span>
      <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-yellow-100/30 to-orange-100/20 opacity-0 dark:opacity-0 light:opacity-100 transition-opacity duration-500"></span>
    </Button>
  )
}


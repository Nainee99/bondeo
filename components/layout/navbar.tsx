"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  useAuth,
  SignInButton,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import {
  BellIcon,
  HomeIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  SearchIcon,
  PlusCircleIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import ModeToggle from "../mode-toggle";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Explore", href: "/explore", icon: SearchIcon },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageCircleIcon,
      authRequired: true,
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: BellIcon,
      authRequired: true,
    },
    { name: "Profile", href: "/profile", icon: UserIcon, authRequired: true },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className={cn(
        "sticky top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-background"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary font-mono tracking-wider flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="bg-primary text-primary-foreground rounded-md w-8 h-8 flex items-center justify-center">
                B
              </span>
              <span className="hidden sm:inline">Bondeo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.authRequired && !isSignedIn) return null;

              return (
                <Button
                  key={item.name}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 px-3 rounded-full transition-all",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Link>
                </Button>
              );
            })}

            {isSignedIn && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full ml-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <Link href="/create">
                  <PlusCircleIcon className="w-4 h-4 mr-2" />
                  <span>Create</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <ModeToggle />

            {/* Auth Buttons */}
            {isSignedIn ? (
              <div className="hidden md:block">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="hidden md:block">
                <SignInButton mode="modal">
                  <Button variant="default" size="sm" className="rounded-full">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                  <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <SheetTitle className="text-left">
                      <Link
                        href="/"
                        className="text-xl font-bold text-primary font-mono tracking-wider flex items-center gap-2"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span className="bg-primary text-primary-foreground rounded-md w-8 h-8 flex items-center justify-center">
                          B
                        </span>
                        Bondeo
                      </Link>
                    </SheetTitle>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <XIcon className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </SheetHeader>

                  {/* Mobile Auth */}
                  <div className="flex items-center justify-between mt-6 mb-6">
                    {isSignedIn ? (
                      <div className="flex items-center gap-3">
                        <UserButton
                          afterSignOutUrl="/"
                          appearance={{
                            elements: {
                              userButtonAvatarBox: "w-10 h-10",
                            },
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            Your Account
                          </span>
                          <span className="text-xs text-muted-foreground">
                            View profile
                          </span>
                        </div>
                      </div>
                    ) : (
                      <SignInButton mode="modal">
                        <Button
                          variant="default"
                          className="w-full rounded-full"
                        >
                          Sign In
                        </Button>
                      </SignInButton>
                    )}
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => {
                      if (item.authRequired && !isSignedIn) return null;

                      return (
                        <SheetClose asChild key={item.name}>
                          <Button
                            variant={isActive(item.href) ? "default" : "ghost"}
                            className={cn(
                              "flex items-center gap-3 justify-start h-12 rounded-lg",
                              isActive(item.href)
                                ? "bg-primary text-primary-foreground"
                                : ""
                            )}
                            asChild
                          >
                            <Link href={item.href}>
                              <item.icon className="w-5 h-5" />
                              {item.name}
                            </Link>
                          </Button>
                        </SheetClose>
                      );
                    })}

                    {isSignedIn && (
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-3 justify-start h-12 rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          asChild
                        >
                          <Link href="/create">
                            <PlusCircleIcon className="w-5 h-5" />
                            Create New Post
                          </Link>
                        </Button>
                      </SheetClose>
                    )}
                  </nav>

                  {/* Mobile Footer */}
                  <div className="mt-auto border-t pt-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Theme</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                      >
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </Button>
                    </div>

                    {isSignedIn && (
                      <SignOutButton>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-3 justify-start w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <LogOutIcon className="w-4 h-4" />
                          Logout
                        </Button>
                      </SignOutButton>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

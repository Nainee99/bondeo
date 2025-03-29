"use client";

import { useState } from "react";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface DeleteAlertDialogProps {
  isDeleting: boolean;
  onDelete: () => Promise<void>;
  title?: string;
  description?: string;
  variant?: "icon" | "text";
  size?: "sm" | "lg";
}

export function DeleteAlertDialog({
  isDeleting,
  onDelete,
  title = "Delete Post",
  description = "This action cannot be undone. This will permanently delete your content and remove it from our servers.",
  variant = "icon",
  size = "sm",
}: DeleteAlertDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="ghost"
            size={size}
            className={cn(
              "text-muted-foreground hover:text-destructive transition-colors",
              "rounded-full hover:bg-destructive/10 focus-visible:ring-destructive",
              isDeleting && "pointer-events-none"
            )}
            disabled={isDeleting}
            aria-label="Delete"
          >
            {isDeleting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <Trash2Icon className="size-4" />
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size={size}
            className={cn(
              "text-destructive hover:text-destructive-foreground hover:bg-destructive",
              "border-destructive/30 hover:border-destructive transition-colors",
              "rounded-full gap-2",
              isDeleting && "pointer-events-none"
            )}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <Trash2Icon className="size-4" />
            )}
            Delete
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-xl border-none shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-2 p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-sm">
          <p className="font-medium text-destructive">Warning:</p>
          <p className="text-muted-foreground">
            This action is permanent and cannot be recovered.
          </p>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="rounded-full border-none mt-0 sm:mt-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={cn(
              "rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90",
              "transition-all duration-200 focus:ring-destructive",
              isDeleting && "opacity-70 pointer-events-none"
            )}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <Loader2Icon className="size-4 animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2Icon className="size-4" />
                <span>Delete</span>
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

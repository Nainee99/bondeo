"use client";

import type React from "react";

import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ImageIcon, Loader2Icon, SendIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { createPost } from "@/actions/post.actions";
import toast from "react-hot-toast";
import ImageUpload from "./image-upload";
import { cn } from "@/lib/utils";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setContent(textarea.value);

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Set the height to scrollHeight to fit the content
    // But limit it to a maximum height
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        // Reset the form
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);

        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }

        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="border-none shadow-md overflow-hidden bg-card">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
              <AvatarImage
                src={user?.imageUrl || "/avatar.png"}
                alt={user?.fullName || "User"}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  placeholder="What's on your mind?"
                  className={cn(
                    "w-full resize-none overflow-hidden border rounded-xl",
                    "bg-muted/30 focus:bg-background transition-colors",
                    "p-3 text-base min-h-[80px] max-h-[200px]",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                  value={content}
                  onChange={handleTextareaChange}
                  disabled={isPosting}
                  rows={1}
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {content.length > 0 && `${content.length}/280`}
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          {(showImageUpload || imageUrl) && (
            <div className="border rounded-xl p-4 bg-muted/10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-primary">Add Image</h3>
                {!imageUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageUpload(false)}
                    className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground rounded-full transition-colors",
                  showImageUpload
                    ? "bg-primary/10 text-primary"
                    : "hover:text-primary",
                  (isPosting || !!imageUrl) && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting || !!imageUrl}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>

            <Button
              className={cn(
                "rounded-full flex items-center gap-2 px-4 transition-all",
                !content.trim() && !imageUrl && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePost;

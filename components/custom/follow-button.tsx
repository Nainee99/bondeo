"use client";

import { toggleFollow } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon, PlusIcon, UserMinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function FollowButton({
  userId,
  isFollowing = false,
}: {
  userId: string;
  isFollowing?: boolean;
}) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [optimisticIsFollowing, setOptimisticIsFollowing] =
    useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (!isSignedIn) {
      return;
    }

    try {
      setIsLoading(true);
      setOptimisticIsFollowing((prev) => !prev);

      const result = await toggleFollow(userId);

      if (!result?.success) {
        // Revert optimistic update if there was an error
        setOptimisticIsFollowing((prev) => !prev);
        throw new Error(result?.error);
      }

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      size="sm"
      className={`rounded-full h-8 px-3 transition-all ${
        optimisticIsFollowing
          ? "bg-background hover:bg-destructive/10 hover:text-destructive border border-input"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
      variant={optimisticIsFollowing ? "outline" : "default"}
    >
      {isLoading ? (
        <Loader2Icon className="h-3 w-3 animate-spin" />
      ) : optimisticIsFollowing ? (
        <UserMinusIcon className="h-3 w-3 mr-1" />
      ) : (
        <PlusIcon className="h-3 w-3 mr-1" />
      )}
      <span>{optimisticIsFollowing ? "Unfollow" : "Follow"}</span>
    </Button>
  );
}

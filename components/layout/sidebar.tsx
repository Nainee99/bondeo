import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { getUserByClerkId } from "@/actions/user.actions";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;

  // Format date to show join date
  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="sticky top-20 transition-all duration-300">
      <Card className="overflow-hidden border-none shadow-md bg-card">
        {/* Header background with gradient */}
        <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5"></div>

        <CardContent className="pt-0 relative px-5">
          {/* Avatar positioned to overlap the header */}
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.username}`}
              className="group relative -mt-10 mb-3"
            >
              <Avatar className="w-20 h-20 border-4 border-background shadow-md transition-transform group-hover:scale-105">
                <AvatarImage
                  src={user.image || "/avatar.png"}
                  alt={user.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            </Link>

            <div className="space-y-1">
              <h3 className="font-semibold text-lg tracking-tight">
                {user.name}
              </h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>

            {/* Edit Profile Button */}
            <Link href="/settings/profile" className="mt-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs h-8 px-3 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <PencilIcon className="w-3 h-3 mr-1" />
                Edit Profile
              </Button>
            </Link>

            {/* Bio with styled container */}
            {user.bio && (
              <div className="mt-4 text-sm text-muted-foreground px-2 py-2 rounded-lg bg-muted/50">
                <p className="italic">{user.bio}</p>
              </div>
            )}

            {/* Stats with improved styling */}
            <div className="w-full mt-4">
              <div className="grid grid-cols-2 gap-1 bg-muted/30 rounded-xl p-3">
                <div className="flex flex-col items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <p className="font-semibold text-lg">
                    {user._count.following}
                  </p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <p className="font-semibold text-lg">
                    {user._count.followers}
                  </p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
            </div>

            {/* User info with icons */}
            <div className="w-full space-y-3 mt-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2 text-primary/70" />
                <span className={cn(!user.location && "italic")}>
                  {user.location || "No location added"}
                </span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0 text-primary/70" />
                {user.website ? (
                  <a
                    href={`${
                      user.website.startsWith("http") ? "" : "https://"
                    }${user.website}`}
                    className="hover:underline truncate text-primary/80 hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                ) : (
                  <span className="italic">No website added</span>
                )}
              </div>
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="w-4 h-4 mr-2 text-primary/70" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-5 py-3 bg-muted/20 flex justify-center">
          <Badge
            variant="outline"
            className="px-3 py-1 rounded-full text-xs font-normal"
          >
            {user.role || "Member"}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Sidebar;

const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card className="overflow-hidden border-none shadow-md">
      {/* Header background with gradient */}
      <div className="h-16 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5"></div>

      <CardHeader className="-mt-6 pb-2">
        <CardTitle className="text-center text-xl font-semibold">
          Join Bondeo Today
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-primary/70" />
          </div>
        </div>

        <p className="text-center text-muted-foreground mb-6 text-sm">
          Connect with friends, share moments, and discover new connections.
        </p>

        <SignInButton mode="modal">
          <Button
            className="w-full rounded-full h-10 transition-all hover:shadow-md"
            variant="outline"
          >
            Log In
          </Button>
        </SignInButton>

        <SignUpButton mode="modal">
          <Button
            className="w-full mt-3 rounded-full h-10 transition-all hover:shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
            variant="default"
          >
            Create Account
          </Button>
        </SignUpButton>

        <p className="text-xs text-center text-muted-foreground mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  </div>
);

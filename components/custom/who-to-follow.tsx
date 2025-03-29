import { getRandomUsers } from "@/actions/user.actions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
// import FollowButton from "./FollowButton";
import FollowButton from "./follow-button";

type User = {
  id: string;
  username: string;
  name: string;
  image?: string;
  _count: {
    followers: number;
  };
};

async function WhoToFollow() {
  const users: User[] = await getRandomUsers();

  if (users.length === 0) return null;

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="pb-3 bg-muted/20">
        <CardTitle className="text-lg font-semibold">Who to Follow</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-5">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-3 items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Link href={`/profile/${user.username}`} className="shrink-0">
                  <Avatar className="w-10 h-10 border border-muted transition-all group-hover:border-primary/20">
                    <AvatarImage
                      src={user.image ?? "/avatar.png"}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="text-sm min-w-0">
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-medium hover:underline truncate block"
                  >
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground text-xs truncate">
                    @{user.username}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {user._count.followers}{" "}
                    {user._count.followers === 1 ? "follower" : "followers"}
                  </p>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
      <div className="px-4 py-3 bg-muted/10 border-t text-center">
        <Link href="/explore" className="text-sm text-primary hover:underline">
          Show more
        </Link>
      </div>
    </Card>
  );
}
export default WhoToFollow;

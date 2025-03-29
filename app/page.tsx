import { getPosts } from "@/actions/post.actions";
import { getDbUserId } from "@/actions/user.actions";
import CreatePost from "@/components/custom/create-post";
import PostCard from "@/components/custom/post-card";
import WhoToFollow from "@/components/custom/who-to-follow";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
      {/* Main Content - Takes 6 columns on large screens */}
      <div className="lg:col-span-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Home</h1>

        {user ? <CreatePost /> : null}

        {posts.length === 0 ? (
          <div className="bg-muted/30 rounded-xl p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              Be the first to share something with the community!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} dbUserId={dbUserId} />
            ))}
          </div>
        )}
      </div>

      {/* Right Sidebar - Takes 3 columns on large screens */}
      <div className="hidden lg:block lg:col-span-3 space-y-6">
        <WhoToFollow />

        {/* Additional widgets */}
        <div className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-xl">
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Help
            </a>
          </div>
          <p>© 2025 Bondeo. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

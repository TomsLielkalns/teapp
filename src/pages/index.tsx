import { RouterOutputs, api } from "~/utils/api";
import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";

const CreatePost = () => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <>
      <div className="flex w-full gap-4">
        <img
          src={user.profileImageUrl}
          alt="Profile image"
          className="h-14 w-14 rounded-full"
        />
        <input
          placeholder="Write something."
          className="grow bg-transparent outline-none"
        ></input>
      </div>
    </>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <img
        src={author.profileImageUrl}
        alt="Post profile image"
        className="h-14 w-14 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex">
          <span>{`@${author.username}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home = () => {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Failed to load data</div>;

  return (
    <>
      <main className="flex justify-center">
        <div className="h-screen w-full border-x border-slate-300 md:max-w-2xl">
          <div className="flex justify-between border-b border-slate-300 p-4">
            {!user.isSignedIn && <SignInButton />}
            {user.isSignedIn && <CreatePost />}
            {user.isSignedIn && <SignOutButton />}
          </div>
          <div className="flex flex-col">
            {[...data, ...data]?.map((postWithAuthor) => (
              <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

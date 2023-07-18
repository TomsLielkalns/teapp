import { api } from "~/utils/api";
import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/LoadingSpinner";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/PostView";

const CreatePost = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.content?.[0];
      if (!errorMessage) {
        toast.error("Failed to create post.");
        return;
      }
      toast.error(errorMessage);
    },
  });
  if (!user) return null;
  return (
    <>
      <div className="flex w-full gap-4">
        <Image
          src={user.profileImageUrl}
          alt="Profile image"
          className="h-14 w-14 rounded-full"
          width={56}
          height={56}
        />
        <input
          placeholder="Write something."
          className="grow bg-transparent outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPosting}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (input !== "") {
                mutate({ content: input });
              }
            }
          }}
        />
        {input !== "" && !isPosting && (
          <button onClick={() => mutate({ content: input })}>Post</button>
        )}
        {isPosting && (
          <div className="flex items-center justify-center">
            <LoadingSpinner size={20} />
          </div>
        )}
      </div>
    </>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  if (postsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );
  if (!data) return <div>Failed to load data</div>;
  return (
    <div className="flex grow flex-col">
      {data.map((postWithAuthor) => (
        <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
      ))}
    </div>
  );
};

const Home = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  // start fetching asap
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <PageLayout>
        <div className="flex justify-between border-b border-slate-300 p-4">
          {!isSignedIn && <SignInButton />}
          {isSignedIn && (
            <>
              <CreatePost />
              <SignOutButton />
            </>
          )}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;

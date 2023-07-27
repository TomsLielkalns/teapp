import { api } from "~/utils/api";
import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/LoadingSpinner";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/PostView";
import { useForm, type SubmitHandler } from "react-hook-form";

type PostFormValues = {
  postContent: string;
};

const CreatePost = () => {
  const { user } = useUser();
  const { register, handleSubmit, formState, reset } =
    useForm<PostFormValues>();

  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
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

  const onSubmitPost: SubmitHandler<PostFormValues> = ({ postContent }) => {
    mutate({ content: postContent });
    reset();
  };

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
        <form
          className="flex grow items-center"
          onSubmit={handleSubmit(onSubmitPost)}
        >
          <input
            {...register("postContent", { required: true })}
            placeholder="Write something."
            className="grow bg-transparent outline-none"
            type="text"
            id="postContent"
            autoComplete="off"
            disabled={isPosting}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(onSubmitPost);
              }
            }}
          />
          {formState.isValid && !isPosting && (
            <button onClick={() => handleSubmit(onSubmitPost)}>Post</button>
          )}
        </form>
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
  const {
    data,
    isLoading: postsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.posts.getAllInfinite.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // initialCursor: 1, // <-- optional you can pass an initialCursor
    }
  );

  if (postsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );
  if (!data) return <div>Failed to load data</div>;

  return (
    <div className="flex grow flex-col">
      {data.pages.map((page, index) => {
        return (
          <div key={index}>
            {page.postsWithAuthorData.map((postWithAuthor) => {
              return (
                <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
              );
            })}
          </div>
        );
      })}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="flex items-center justify-center"
        >
          {" "}
          Fetch more data{" "}
        </button>
      )}
    </div>
  );
};

const Home = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

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

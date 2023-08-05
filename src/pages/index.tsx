import { api } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/LoadingSpinner";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/PostView";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCallback } from "react";

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
      void ctx.posts.getAllInfinite.invalidate();
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
      <div className="mt-20 flex w-full gap-4">
        <Image
          src={user.profileImageUrl}
          alt="Profile image"
          className="h-14 w-14 rounded-full"
          width={56}
          height={56}
          priority
        />
        <form
          className="flex grow items-center"
          onSubmit={handleSubmit(onSubmitPost)}
        >
          <input
            {...register("postContent", { required: true })}
            placeholder="Write something..."
            className="grow bg-transparent outline-none"
            type="text"
            id="postContent"
            autoComplete="off"
            disabled={isPosting}
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
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      // initialCursor: 1, // <-- optional you can pass an initialCursor
    }
  );

  // since useRef assigned loadMoreButtonRef.current to null before the button was rendered
  // and also didnt update when the button was rendered, even AFTER using useLayoutEffect
  // creating a ref via callback function fixed the issue
  const loadMoreButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (node && IntersectionObserver) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting) {
              void fetchNextPage();
            }
          },
          {
            rootMargin: "0px",
            threshold: 0.0,
          }
        );
        observer.observe(node);
      }
    },
    [fetchNextPage]
  );

  if (postsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );
  if (!data) return <div>Failed to load data</div>;

  let buttonText;
  if (isFetchingNextPage) {
    buttonText = "Loading more...";
  } else if (hasNextPage) {
    buttonText = "Load More";
  } else {
    buttonText = "Nothing more to load";
  }

  return (
    <div className="flex grow flex-col">
      {data.pages.map((page) => {
        return (
          <div key={page.nextCursor ?? "last data"}>
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
          ref={loadMoreButtonRef}
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage || !hasNextPage}
          className="flex items-center justify-center"
        >
          {buttonText}
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
        <div className="flex justify-center border-b border-slate-300 p-4 pt-1">
          {isSignedIn && <CreatePost />}
          {!isSignedIn && (
            <div className="mt-20">
              <SignInButton>Sign in to post!</SignInButton>
            </div>
          )}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;

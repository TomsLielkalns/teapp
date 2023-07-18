import Head from "next/head";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { prisma } from "~/server/db";
import { type GetStaticProps } from "next";
import { PageLayout } from "~/components/Layout";
import Image from "next/image";
import { LoadingPage } from "~/components/LoadingSpinner";
import { PostView } from "~/components/PostView";

const ProfileFeed = (props: { authorId: string }) => {
  const { authorId } = props;
  const { data, isLoading } = api.posts.getPostsByAuthorId.useQuery({
    authorId,
  });

  if (isLoading) return <LoadingPage />;
  if (!data || data.length === 0) return <div>User has not posted yet.</div>;

  return (
    <>
      <div className="flex flex-col">
        {data.map((fullPost) => (
          <PostView key={fullPost.post.id} {...fullPost} />
        ))}
      </div>
    </>
  );
};

const ProfilePage = (props: { userId: string }) => {
  const { userId } = props;
  const { data } = api.profile.getUserByUserId.useQuery({
    userId,
  });
  if (!data) return <div>Failed to load data</div>;
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-48 border-slate-400 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username}'s profile image`}
            width={150}
            height={150}
            className="absolute bottom-0 left-0 -mb-[75px] ml-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-[75px]" />
        <div className="p-4 text-2xl font-bold">{`@${data.username}`}</div>
        <div className="border-b border-slate-400" />
        <ProfileFeed authorId={userId} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const userId = context.params?.userId;

  if (typeof userId !== "string") throw new Error("slug is not a string");

  await ssg.profile.getUserByUserId.prefetch({ userId: userId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      userId,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;

import Head from "next/head";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { prisma } from "~/server/db";
import { type GetStaticProps } from "next";

const ProfilePage = () => {
  const { data, isLoading } = api.profile.getUserByUserId.useQuery({
    userId: "user_2SdCmZ3hkfm52DJkbOkg1yMcKUe",
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Failed to load data</div>;
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex justify-center">
        <div className="h-screen w-full border-x border-slate-300 md:max-w-2xl">
          <div className="flex justify-between border-b border-slate-300 p-4">
            <div>{data.username}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("slug is not a string");

  await ssg.profile.getUserByUserId.prefetch({ userId: slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
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

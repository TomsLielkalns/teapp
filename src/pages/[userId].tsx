import Head from "next/head";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { prisma } from "~/server/db";
import { type GetStaticProps } from "next";
import { PageLayout } from "~/components/layout";

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
        <div>{data.username}</div>
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

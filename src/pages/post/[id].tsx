import Head from "next/head";
import { api } from "~/utils/api";
import { type GetStaticProps } from "next";
import { PageLayout } from "~/components/Layout";
import { generateSsgHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/PostView";

const SinglePostPage = (props: { id: string }) => {
  const { id } = props;
  const { data } = api.posts.getPostById.useQuery({
    id,
  });
  if (!data) return <div>Failed to load data</div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <div className="mt-20">
          <PostView {...data} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSsgHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("id is not a string");

  await ssg.posts.getPostById.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePostPage;

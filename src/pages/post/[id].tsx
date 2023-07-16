import Head from "next/head";

const SinglePostPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex justify-center">
        <div className="h-screen w-full border-x border-slate-300 md:max-w-2xl">
          <div className="flex justify-between border-b border-slate-300 p-4">
            Single Post View
          </div>
        </div>
      </main>
    </>
  );
};

export default SinglePostPage;

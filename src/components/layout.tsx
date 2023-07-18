import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <>
      <main className="flex justify-center">
        <div className="no-scrollbar h-screen w-full overflow-y-scroll border-x border-slate-300 md:max-w-2xl">
          {children}
        </div>
      </main>
    </>
  );
};

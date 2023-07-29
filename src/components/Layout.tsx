import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <>
      <main className="flex justify-center">
        <div className="no-scrollbar h-screen w-full overflow-y-scroll border-x border-slate-300 bg-gray-800 drop-shadow-2xl md:max-w-2xl">
          {children}
        </div>
      </main>
    </>
  );
};

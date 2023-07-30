import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { PropsWithChildren } from "react";

const NavBar = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  if (!userLoaded) return <div />;

  return (
    <div className="h-0">
      <nav className="sticky left-0 top-0 z-20 w-full border-b border-gray-200 bg-transparent backdrop-blur-sm dark:border-gray-600">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              Home
            </span>
          </Link>
          <div className="flex md:order-2">
            <button
              type="button"
              className="mr-3 rounded-lg bg-slate-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800 md:mr-0"
            >
              {isSignedIn && <SignOutButton />}
              {!isSignedIn && <SignInButton />}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export const PageLayout = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <>
      <NavBar />
      <main className="flex justify-center">
        <div className="no-scrollbar h-screen w-full overflow-y-scroll border-x border-slate-300 bg-gray-800 bg-gradient-to-r from-pink-950 to-slate-800 drop-shadow-2xl md:max-w-2xl">
          {children}
        </div>
      </main>
    </>
  );
};

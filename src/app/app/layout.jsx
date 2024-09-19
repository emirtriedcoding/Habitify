import ThemeProvider from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";

import NextTopLoader from "nextjs-toploader";

import CheckTrial from "@/components/app/CheckTrial";
import Nav from "@/components/app/Nav";

import Sidebar from "@/components/app/Sidebar";
import Feedback from "@/components/app/Feedback";
import Profile from "@/components/modals/Profile";

import { redirect } from "next/navigation";
import { authUser } from "@/lib/helpers";

const AppLayout = async ({ children }) => {
  const user = await authUser();

  if (!user) return redirect("/?auth=true");

  return (
    <ThemeProvider>
      <QueryProvider>
          <div className="flex">
            <NextTopLoader height={5} color="#65C3C8" />
            <Sidebar />
            <div className="w-full lg:mr-[200px]">
              <CheckTrial />
              <Nav image={JSON.parse(JSON.stringify(user)).image} />
              <Profile
                name={user.name}
                username={user.username}
                email={user.email}
                image={user.image}
                isPaid={user.isPaid}
              />
              <main className="relative z-40 p-5">{children}</main>
            </div>
            <Feedback />
          </div>
      </QueryProvider>
    </ThemeProvider>
  );
};

export default AppLayout;

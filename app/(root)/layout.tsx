import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  console.log("Hello from (ROOT)");
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/sign-in");

  return (
    <>
      <main className="flex h-screen">
        <Sidebar {...currentUser} />
        <section className="flex flex-1 flex-col h-full ">
          <MobileNavigation {...currentUser} />
          <Header userId={currentUser.$id} accountId={currentUser.accountId} />
          <div className="main-content">{children}</div>
        </section>
        <Toaster />
      </main>
    </>
  );
};

export default Layout;

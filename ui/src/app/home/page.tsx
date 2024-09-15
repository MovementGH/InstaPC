"use client";
import { Computer } from "lucide-react";
import VMList from "@/components/vm-list";
import { useState } from "react";
import {
  withAuthInfo,
  useRedirectFunctions,
  WithAuthInfoProps,
} from "@propelauth/react";
import Nav from "@/components/nav";

const Home = (props: WithAuthInfoProps) => {
  const [logoutbttn ] = useState(props.isLoggedIn);
  const {
    redirectToLoginPage,
  } = useRedirectFunctions();
  if (!logoutbttn) {
    redirectToLoginPage();
    return null;
  }
  return (
    <div className="flex grow overflow-hidden">
      <Nav />
      <main className="flex flex-col items-center p-4 w-full">
        <div className="max-w-7xl w-full mt-6">
          <h1 className="font-bold text-xl mb-4 text-foreground">
            Available PCs
          </h1>
          <VMList />
        </div>
      </main>
    </div>
  );
};

export default withAuthInfo(Home);

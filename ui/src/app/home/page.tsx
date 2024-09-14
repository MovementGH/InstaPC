"use client";
import { Computer } from "lucide-react";
import VMList from "@/components/vm-list";
import { useState } from "react";
import {
  withAuthInfo,
  useRedirectFunctions,
  useLogoutFunction,
  WithAuthInfoProps,
} from "@propelauth/react";
import Nav from "@/components/nav";
const Home = (props: WithAuthInfoProps) => {
  const [logoutbttn, setlogoutbttn] = useState(props.isLoggedIn);
  const logoutFunction = useLogoutFunction();
  const {
    redirectToLoginPage,
  } = useRedirectFunctions();
  if (!logoutbttn) {
    redirectToLoginPage();
    return null;
  }
  return (
    <div className="flex grow">
      <Nav />
      <main className="flex flex-col items-center p-4 w-full">
        <div className="max-w-7xl w-full mt-12">
          <h1 className="font-bold text-xl mb-4 text-muted">
            Available PCs <Computer className="inline ml-1 size-5 mb-1" />
          </h1>
          <VMList />
        </div>
      </main>
    </div>
  );
};

export default withAuthInfo(Home);

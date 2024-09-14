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
    <main className="flex flex-col grow justify-center items-center p-4 w-full">
      <div className="max-w-7xl w-full mt-12">
        <div>
          {logoutbttn ? (
            <div className="flex items-center space-x-4">
              <p className="text-green-500">
                Current Session: {props.user?.email}
              </p>
              <button
                onClick={() => logoutFunction(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
        <h1 className="font-bold text-xl mb-4 text-gray-300">
          Available PCs <Computer className="inline ml-1 size-5 mb-1" />
        </h1>
        <VMList />
      </div>
    </main>
  );
};

export default withAuthInfo(Home);

"use client"
import { Computer } from "lucide-react";
import VMList from "@/components/vm-list";
import { useState } from "react";
import { withAuthInfo, useRedirectFunctions, useLogoutFunction, WithAuthInfoProps } from '@propelauth/react'
const Home = (props: WithAuthInfoProps) => {
    const [logoutbttn, setlogoutbttn] = useState(props.isLoggedIn);
    const logoutFunction = useLogoutFunction();
    const { redirectToOrgPage, redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions();
    if(!logoutbttn) {
        redirectToLoginPage();
        return null;
    }
    return (
        <div className="max-w-7xl w-full mt-12">
         
        <h1 className="font-bold text-xl mb-4 text-gray-300">Available PCs <Computer className="inline ml-1 size-5 mb-1"/></h1>
            <VMList />
        <div>
        {logoutbttn ? (
          <div className="flex items-center space-x-4">
            <p className="text-green-500">Current Session: {props.user?.email}</p>
            <button
              onClick={() =>logoutFunction(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
            </div>) : <></>}
          </div>
        </div>
    )


    // return (
        //         <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        //             <div className="mb-6 bg-teal-100 p-4 rounded-md">
        //                 <h2 className="text-xl font-semibold text-teal-800">Welcome!</h2>
        //                 <p className="text-gray-600 mt-2">You are logged in as <span className="font-medium">{props.user.email}</span></p>
        //             </div>
        //             <button
        //                 className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full mb-2"
        //                 onClick={() => redirectToAccountPage()}
        //             >
        //                 Account
        //             </button>
        //             <button
        //                 className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors w-full"
        //                 onClick={() => logoutFunction(true)}
        //             >
        //                 Logout
        //             </button>
        //         </div>
        // );
}


export default withAuthInfo(Home);
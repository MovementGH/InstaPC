"use client"
import { withAuthInfo, useRedirectFunctions, useLogoutFunction, WithAuthInfoProps } from '@propelauth/react'

const YourApp = withAuthInfo((props: WithAuthInfoProps) => {
    const logoutFunction = useLogoutFunction();
    const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions();
    if (props.isLoggedIn) { 
        return (
                <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
                    <div className="mb-6 bg-teal-100 p-4 rounded-md">
                        <h2 className="text-xl font-semibold text-teal-800">Welcome!</h2>
                        <p className="text-gray-600 mt-2">You are logged in as <span className="font-medium">{props.user.email}</span></p>
                    </div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full mb-2"
                        onClick={() => redirectToAccountPage()}
                    >
                        Account
                    </button>
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors w-full"
                        onClick={() => logoutFunction(true)}
                    >
                        Logout
                    </button>
                </div>
        );
    } else {
        return (
                <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
                    <div className="mb-6 p-4 rounded-md">
                        <h2 className="text-xl font-semibold text-orange-500">Hello!</h2>
                        <p className="text-gray-600 mt-2">Login with <span className=" font-semibold text-green-800">PropelAuth</span></p>
                    </div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full mb-2"
                        onClick={() => redirectToLoginPage()}
                    >
                        Login
                    </button>
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors w-full"
                        onClick={() => redirectToSignupPage()}
                    >
                        Signup
                    </button>
                </div>
        );
    }
});

export default YourApp
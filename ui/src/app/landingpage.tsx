"use client";
import AuthUI from "./auth/authUI";
import { withAuthInfo, useRedirectFunctions, useLogoutFunction, WithAuthInfoProps } from '@propelauth/react'
import { useEffect } from "react";

import { redirect } from "next/navigation";
import{
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordian";

function LandingPageUI(props: WithAuthInfoProps) {
  const { redirectToOrgPage, redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions();

  useEffect(() => {
    if (props.isLoggedIn) {
      redirect("/home");
    }
  }, [props.isLoggedIn, redirect]);

  if(!props.isLoggedIn){
  return (
    <main className="flex flex-col grow justify-center items-center p-8 w-full bg-background from-blue-500 to-purple-600 text-white">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-extrabold mb-4">
          Welcome to <span className="text-orange-500">Insta PC</span>
        </h1>
        <p className="text-lg mb-6">
          Create custom virtual desktop instances directly from your browser.
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <button  onClick={() => redirectToSignupPage()}  className="bg-orange-500 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-800 transition">
            Get Started
          </button>
          <button  onClick={() => redirectToLoginPage()}  className="bg-green-500 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition">
           Log In
          </button>
        </div>
      </div>
        <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
        <AccordionTrigger>Who is it for?</AccordionTrigger>
         <AccordionContent>
            Whoever wants to play around with desktops through their browsers <span className="text-orange-500">instantly!</span>
         </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
        <AccordionTrigger>How does it work?</AccordionTrigger>
         <AccordionContent>
            Select your favourite Desktop OS and desired specs, and you're <span className="text-orange-500">Done!</span>
         </AccordionContent>
        </AccordionItem>
        </Accordion>
    </main>
  );
} 
return null;

}

export default withAuthInfo(LandingPageUI);
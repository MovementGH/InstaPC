"use client";
import { withAuthInfo, useRedirectFunctions, WithAuthInfoProps } from '@propelauth/react'
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use useRouter for client-side navigation

import{
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordian";

function LandingPageUI(props: WithAuthInfoProps) {
  const { redirectToLoginPage, redirectToSignupPage } = useRedirectFunctions();

  const router = useRouter();
  useEffect(() => {
    if (props.isLoggedIn) {
      router.push("/home");
    }
  }, [props.isLoggedIn, router]);

  if(!props.isLoggedIn){
  return (
    <main className="flex flex-col grow justify-center items-center p-8 w-full bg-background from-blue-500 to-purple-600 text-foreground">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-extrabold mb-4">
          Welcome to <span className="text-primary">Insta PC</span>
        </h1>
        <p className="text-lg mb-6">
          Create custom virtual desktop instances directly from your browser.
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <button  onClick={() => redirectToSignupPage()}  className="bg-primary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary/80 transition">
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
            Whoever wants to play around with desktops through their browsers <span className="text-primary">instantly!</span>
         </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
        <AccordionTrigger>How does it work?</AccordionTrigger>
         <AccordionContent>
            Select your favourite Desktop OS and desired specs, and you&apos;re <span className="text-primary">Done!</span>
         </AccordionContent>
        </AccordionItem>
        </Accordion>
    </main>
  );
} 
return null;

}

export default withAuthInfo(LandingPageUI);
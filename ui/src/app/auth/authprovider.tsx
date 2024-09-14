 // Mark this component as a client component
 "use client"
 import {  AuthProvider, withAuthInfo, useRedirectFunctions, useLogoutFunction, WithAuthInfoProps } from '@propelauth/react'

import {} from '@propelauth/react';


export default function ClientAuthProvider({ children }: { children: React.ReactNode }) {
    return (
    <AuthProvider authUrl={process.env.NEXT_PUBLIC_PROPEL_AUTH_URL!}>
      {children}
    </AuthProvider>
  );
}
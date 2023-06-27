import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import "../styles/globals.css"
import { Raleway } from 'next/font/google';

const raleway = Raleway({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --raleway: ${raleway.style.fontFamily}, sans-serif;
        }
      `}</style>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}

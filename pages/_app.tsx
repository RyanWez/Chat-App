import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="A modern chat application" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="alternate icon" href="/favicon/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
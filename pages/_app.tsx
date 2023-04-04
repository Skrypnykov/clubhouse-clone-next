import Head from "next/head";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title>Clubhouse: Drop-in audio chat</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

import '../styles/globals.scss';
import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { wrapper } from "../redux/store"

const MyApp: React.FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Clubhouse: Drop-in audio chat</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
import '../styles/globals.scss';

import React from 'react';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import { wrapper } from '../redux/store';

class MyApp extends App {
  static async getServer({ Component, ctx }: AppContext) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Clubhouse: Drop-in audio chat</title>
        </Head>
        <Component {...pageProps} />
      </>
    )

  }
}

export default wrapper.withRedux(MyApp);
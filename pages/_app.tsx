import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from "next/head";

import dynamic from "next/dynamic";
import { WalletBalanceProvider } from "hooks/useWalletBalance";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletConnectionProvider = dynamic(
  () => import("components/WalletConnection/WalletConnectionProvider"),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  const pageUrl = "";
  const logoImg = "/icon.png";
  const title = "Soul Dogs Raffle";
  const description = "Welcome to Soul Dogs, a collection of 1111 Samoyeds living on the Solana Network. Our roadmap consists of weekly token airdrops, breeding, a DAO, and much more!";

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/icon.png" />
        <meta name="description" key="description" content={description} />
        <meta property="og:title" key="og:title" content={title} />
        <meta property="og:url" key="og:url" content={pageUrl} />
        <meta property="og:image" key="og:image" content={logoImg} />
        <meta property="og:description" key="og:description" content={description} />
        <meta property="twitter:title" key="twitter:title" content={title} />
        <meta property="twitter:site_name" key="twitter:site_name" content={pageUrl} />
        <meta property="twitter:url" key="twitter:url" content={pageUrl} />
        <meta property="twitter:image" key="twitter:image" content={logoImg} />
        <meta property="twitter:description" key="twitter:description" content={description} />
      </Head>
      <WalletConnectionProvider>
        <Component {...pageProps} />
      </WalletConnectionProvider>
    </>
  )
}

export default MyApp

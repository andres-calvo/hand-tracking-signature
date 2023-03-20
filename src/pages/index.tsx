import Head from "next/head";
import { HandTracking } from "@/components/HandTracking";

export default function Home() {
  return (
    <>
      <Head>
        <title>Hand Tracking Signature</title>
        <meta name="description" content="Draw your signature with AI Hand Tracking" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HandTracking />
    </>
  );
}

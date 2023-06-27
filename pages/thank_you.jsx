import Head from "next/head";
import clientPromise from "../lib/mongodb";
import ThankYou from "../components/ThankYou"

import styles from "../styles/volunteer.module.css";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  try {
    await clientPromise;
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default function Home({ isConnected }) {
  const router = useRouter();

  return (
    <div className={styles.container}>
        <Head>
          <title>
            Thank you! | Observe
          </title>
        </Head>
      <ThankYou eventId={router.query.eventId}></ThankYou>
    </div>
  );
}

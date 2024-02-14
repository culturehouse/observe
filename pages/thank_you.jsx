import Head from "next/head";
import ThankYou from "../components/ThankYou"
import styles from "../styles/volunteer.module.css";
import { useRouter } from "next/router";

export default function Home() {
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

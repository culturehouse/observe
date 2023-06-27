import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { useState } from "react";
import Crumbs from "../components/Crumbs";
import { useRouter } from 'next/router'
import styles from "../styles/create_instance.module.css"; 
import ObserveLogo from "../components/ObserveLogo";
import PleaseLogin from '../components/PleaseLogin'

import Canvas from "../components/Canvas.jsx";
import NoAccess from "../components/NoAccess";
import BackgroundBottom4 from "../components/BackgroundBottom4"

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

export default function Mapping({ isConnected }) {
  const [loggedIn, setLoggedIn] = useState(true);
  const [canAccess, setCanAccess] = useState(true);
  const router = useRouter();

  const { eventId } = router.query;

  if (loggedIn && canAccess) {
    return (
      <div className={styles.world}>
        <Head>
          <title>
            Create new stop and stay instance | Observe
          </title>
        </Head>
        <BackgroundBottom4></BackgroundBottom4>
        <div className={styles.border}>
          <ObserveLogo></ObserveLogo>
          <div>
            <Crumbs crumbs={{
              np: "",
              event: { id: router.query.eventId, name: router.query.eventName },
              proj: { id: router.query.projId, name: router.query.projName }
            }}
              ending={"Create instance"}>
            </Crumbs>
          </div>
          <div>
            <p className={styles.create}>Create new instance</p>
          </div>
          <Canvas setLoggedIn={setLoggedIn} setCanAccess={setCanAccess}/>
        </div>
      </div>
    );
  } else if (!loggedIn) {
    return <PleaseLogin/>
  } else {
    return <NoAccess/>
  }

}

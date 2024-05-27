import Head from "next/head";
import { useState } from "react";
import Crumbs from "../components/Crumbs";
import { useRouter } from "next/router";
import styles from "../styles/create_instance.module.css";
import ObserveLogo from "../components/ObserveLogo";
import PleaseLogin from "../components/PleaseLogin";
import Canvas from "../components/Canvas.jsx";
import NoAccess from "../components/NoAccess";
import BackgroundBottom4 from "../components/BackgroundBottom4";

export default function Mapping() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [canAccess, setCanAccess] = useState(true);
  const router = useRouter();

  if (loggedIn && canAccess) {
    return (
      <div className={styles.world}>
        <Head>
          <title>Create new stop and stay observation | Observe</title>
        </Head>
        <BackgroundBottom4></BackgroundBottom4>
        <div className={styles.border}>
          <ObserveLogo></ObserveLogo>
          <div>
            <Crumbs
              crumbs={{
                event: {
                  id: router.query.eventId,
                  name: router.query.eventName,
                },
                proj: { id: router.query.projId, name: router.query.projName },
              }}
              ending={"Create Observation"}
            ></Crumbs>
          </div>
          <div>
            <p className={styles.create}>Create new observation</p>
          </div>
          <Canvas setLoggedIn={setLoggedIn} setCanAccess={setCanAccess} />
        </div>
      </div>
    );
  } else if (!loggedIn) {
    return <PleaseLogin />;
  } else {
    return <NoAccess />;
  }
}

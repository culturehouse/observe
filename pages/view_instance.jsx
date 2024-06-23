import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/view_instance.module.css";
import ObserveLogo from "../components/ObserveLogo";
import Crumbs from "../components/Crumbs";
import CanvasViewInstance from "../components/CanvasViewInstance";
import BackgroundBottom1 from "../components/BackgroundBottom1";

export default function View_Instance() {
  const [instance, setInstance] = useState([{ title: "Loading..." }]);
  const [dataFetched, setDataFetched] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id && !dataFetched) {
      fetch(`/api/view_instance/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "GET",
      })
        .then((data) => data.json())
        .then((r) => {
          setInstance(r);
          setDataFetched(true);
        });
    }
  }, [id]);

  return (
    <div className={styles.container}>
      <Head>
        <title>View stop and stay observation | Observe</title>
      </Head>
      <div className={styles.border}>
        <BackgroundBottom1></BackgroundBottom1>
        <ObserveLogo />
        <div className={styles.crumbs}>
          <Crumbs
            crumbs={{
              proj: { name: router.query.projName, id: router.query.projId },
              event: { name: router.query.eventName, id: router.query.eventId },
            }}
            ending={"View observation"}
          ></Crumbs>
        </div>
        <div className={styles.title}>
          <h1 className={styles.maintitle}>View observation</h1>
        </div>
        {instance ? (
          <CanvasViewInstance instance={instance} />
        ) : (
          <CanvasViewInstance
            instance={[
              {
                dateTime: "",
                notes: "",
                temperature: "",
                time: "",
                volunteerName: "",
                weather: "",
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}

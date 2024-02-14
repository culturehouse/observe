import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from "../styles/view_instance.module.css"
import ObserveLogo from "../components/ObserveLogo";
import Crumbs from '../components/Crumbs'
import CanvasViewInstance from "../components/CanvasViewInstance";
import BackgroundBottom1 from "../components/BackgroundBottom1"

// next 20 lines are just for background display purposes
// function getWindowDimensions() {
//   const { innerWidth: width, innerHeight: height } = window;
//   return {
//     width,
//     height
//   };
// }

export default function View_Event() {
  const [instance, setInstance] = useState([{"title": "Loading..."}]);
  const [dataFetched, setDataFetched] = useState(false);

  // const [height, setHeight] = useState(0)
  const ref = useRef(null)

  const router = useRouter();
  const { id } = router.query;


  useEffect (() => {
    // previous fetch for reference:
    //const response = fetch(`http://localhost:3001/view_event/${id}`, {
    const response = fetch(`/api/view_instance/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      method: 'GET',
    }).then((data) => data.json()).then((r) => 
    {
      setInstance(r);
      setDataFetched(true);
    });
  },[router]);


  console.log(instance[0])
  return (
    <div className={styles.container}>
      <Head>
        <title>
          View stop and stay instance | Observe
        </title>
      </Head>
      <div className={styles.border}>
        <BackgroundBottom1></BackgroundBottom1>
        <ObserveLogo />
        <div className={styles.crumbs}>
          <Crumbs crumbs={{ proj: { name: router.query.projName, id: router.query.projId }, event: {name: router.query.eventName, id: router.query.eventId} }} ending={"View instance"}></Crumbs>
          {/* <Crumbs crumbs={{ proj: { name: router.query.projName, id: router.query.projId }, event: {name: router.query.eventName, id: router.query.eventId} }} ending={instance[0] ? instance[0]["id"] : ""}></Crumbs> */}
        </div>
        <div className={styles.title}>
          <h1 className={styles.maintitle}>View instance</h1>
        </div>
        { instance ? <CanvasViewInstance instance={instance}/>
                   : <CanvasViewInstance instance={[{dateTime: "", notes: "", temperature: "", time: "", volunteerName: "", weather: ""}]}/>
        }
        {/* <DensityGraph data={instance[0].data} backgroundLink={`https://culturehouse-images.s3.ap-northeast-2.amazonaws.com/events/${router.query.eventId}.png`}/> */}
        {/* <div className={styles.densityGraph}>
          <DensityGraph data={instance[0].data}/>
        </div> */}
      </div>
    </div>
  );
}
// for developer reference

import Head from 'next/head'
import { useEffect } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import clientPromise from '../lib/mongodb'
import styles from "../styles/view_event.module.css"
import culturehouse_logo from "../images/culturehouse_logo.png" 
import heatmap_template from "../images/heatmap_template.png" 
import Event from "./create_event.jsx"
import btnstyles from "../styles/button.module.css"
// import { useNavigate } from 'react-router-dom';

export async function getServerSideProps(context) {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function View_Event({isConnected}) {
  const [dataFetched, setDataFetched] = useState(false);

  var id;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParameters = new URLSearchParams(window.location.search);
      id = queryParameters.get("id");
      console.log(id);
      setDataFetched(true);
    }}, []);

  return (
    <div>
      {dataFetched && <img src={`https://culturehouse-images.s3.ap-northeast-2.amazonaws.com/${id}.png`}/>}
    </div>
  )
}

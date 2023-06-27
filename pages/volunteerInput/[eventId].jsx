import Head from "next/head";
import clientPromise from "../../lib/mongodb";
import { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router'
import styles from "../../styles/create_instance.module.css";
import ObserveLogo from "../../components/ObserveLogo";

import VolunteerCanvas from "../../components/VolunteerCanvas";

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
  const router = useRouter();

    return (
      <div className={styles.world}>
        <div className={styles.border}>
          <ObserveLogo></ObserveLogo>
          <div>
      
          </div>
          <div>
            <p className={styles.create}>Create new instance</p>
          </div>
          <VolunteerCanvas eventId={router.query.eventId}/>
        </div>
      </div>
    );

}

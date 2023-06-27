import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import styles from "../styles/create_event.module.css"
import culturehouse_logo from "../images/culturehouse_logo.png" 
import btnstyles from "../styles/button.module.css"
import { BsImage } from "react-icons/bs"
import { FiX } from "react-icons/fi"

import AWS from 'aws-sdk'

const S3_BUCKET ='culturehouse-images';
const REGION ='ap-northeast-2';


AWS.config.update({
    accessKeyId: 'AKIA2AAODY6NWVHHAZ4B',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

// known bugs: update sketch doens't always work

export async function getServerSideProps(context) {
  try {
    await clientPromise
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

// function to post to database


export default function Events({isConnected, setshowCreateEvent, eventInfo}) {
    console.log("eventInfo is ");


    const [title, setTitle] = useState(eventInfo[0].title);
    const [date, setDate] = useState(eventInfo[0].date);
    const [location, setLocation] = useState(eventInfo[0].location);
    const [notes, setNotes] = useState(eventInfo[0].notes);
    const [ sketchFile, setSketchFile ] = useState(null);
    const [progress , setProgress] = useState(0);
    const [ imageUploaded, setImageUploaded ] = useState(false);

    console.log("title: " + title + ", date: " + date + ", location: " + location + "notes: " + notes);

    const postToDatabase = async () => {
    //   alert("not implemented yet");
      const response = await fetch(`/api/update_event/${eventInfo[0].id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        method: 'PUT',
        body: JSON.stringify({
          title: title,
          date: date,
          location: location,
          notes: notes,
          imageUploaded: imageUploaded,
        }),
      }).then((r) => console.log(r));
      uploadFile(sketchFile).then(() => {
        window.location.reload(false);
      });
    }

    const uploadFile = (file) => {

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: 'events/' + eventInfo[0].id + '.png' // replace events with either events, heatmaps, or projects
        };

        return new Promise((resolve, reject) => {
          myBucket.putObject(params)
              .on('httpUploadProgress', (evt) => {
                  setProgress(Math.round((evt.loaded / evt.total) * 100))
              })
              .send((err) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    resolve();
                  }
              });
        })
    }

    const handleFileChange = (e) => {
      // console.log("handling file change")
      if (e.target.files) {
        // console.log("recognized file")
        setImageUploaded(true);
        setSketchFile(e.target.files[0]);
      }
    };

  if (sketchFile) console.log(sketchFile)

  return (
    <div className={styles.dimmer}>
      <div className={styles.container}>
        <Head>
          <title>
            Edit event | Observe
          </title>
        </Head>
        <div className={styles.closeButton} onClick={() => {setshowCreateEvent(false)}}><FiX size={20}/></div>
        <br/><br/><br/> 
        <div className={styles.title}>
          <h3>Edit event</h3>
        </div>
        <br/><br/>
        <div className={styles.topHalfData}>
          <h4 className={styles.fieldTitle}>Event title</h4> 
          <input className={styles.textInput} type="text" onChange={(e) => setTitle(e.target.value)} value={title}/> <br/><br/> 
          <h4 className={styles.fieldTitle}>Start date</h4> <input className={styles.textInput} type="date" onChange={(e) => setDate(e.target.value)} value={date}/> <br/><br/>
        </div>
        <div>
            <h4 className={styles.fieldTitle}>Location</h4> <input className={styles.textInput} type="text" onChange={(e) => setLocation(e.target.value)} value={location}/> <br/><br/>
            <h4 className={styles.fieldTitle}>Notes</h4> <input className={styles.textInput} type="text" onChange={(e) => setNotes(e.target.value)} value={notes}/> <br/><br/>
            <div className={styles.fileSelectContainer}>
              <label className={styles.fileContainer}>
                  {/* <input className={styles.fileInput} type="file" checked={sketch} onChange={(e) => setSketch(!sketch)}/> */}
                  <input className={styles.fileInput} type="file" checked={sketchFile != null} onChange={(e) => handleFileChange(e)}/>
                  <BsImage />
                  <p>{sketchFile != null ? sketchFile.name : eventInfo[0].id + ".jpg"}</p>
              </label>
              <p className={styles.x} onClick={() => {console.log("bruh"); setSketchFile(null)}}><FiX /></p>
              {/* <div>Sketch upload progress is {progress}%</div> */}
            </div>
            <br></br> <br/>
        </div>
        <div className={styles.createProject}>
          <div className={btnstyles.buttonCreate} onClick={() => {uploadFile(sketchFile); postToDatabase()}}>UPDATE EVENT</div>
        </div> 
        <Image className={styles.popupEllipse} src="/PopupEllipse.png" width={153} height={160} alt=""/>
        <Image className={styles.popupPolygon} src="/PopupPolygon.png" width={104} height={240} alt=""/>
      </div>
    </div>
  )
}
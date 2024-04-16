import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import styles from "../styles/create_event.module.css";
import btnstyles from "../styles/button.module.css";
import { BsImage } from "react-icons/bs";
import { FiX } from "react-icons/fi";

import AWS from "aws-sdk";

const S3_BUCKET = "culturehouse-images";
const REGION = "ap-northeast-2";

AWS.config.update({
  accessKeyId: "AKIA2AAODY6NWVHHAZ4B",
  secretAccessKey: "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",
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export default function Events({ setShowCreateEvent, eventInfo = [] }) {
  const [title, setTitle] = useState(eventInfo[0]?.title ?? "");
  const [date, setDate] = useState(eventInfo[0]?.date ?? "");
  const [location, setLocation] = useState(eventInfo[0]?.location ?? "");
  const [notes, setNotes] = useState(eventInfo[0]?.notes ?? "");
  const [imageUploaded, setImageUploaded] = useState(
    eventInfo[0]?.imageUploaded ?? false
  );
  const [sketchFile, setSketchFile] = useState(
    eventInfo[0]?.imageUploaded ? { name: `${eventInfo[0]?.id}.jpg` } : null
  );
  const [progress, setProgress] = useState(0);

  const uploadFile = (file) => {
    const id = eventInfo[0]?.id;
    if (id === undefined) return;

    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: `events/${id}.png`, // replace events with either events, heatmaps, or projects
    };

    return new Promise((resolve, reject) => {
      myBucket
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        })
        .send((err) => {
          if (err) {
            reject(err);
          } else {
            resolve("The event sketch is uploaded.");
          }
        });
    });
  };

  const deleteFile = () => {
    const id = eventInfo[0]?.id;
    if (id === undefined) return;

    const params = {
      Bucket: S3_BUCKET,
      Key: `events/${id}.png`, // replace events with either events, heatmaps, or projects
    };

    return new Promise((resolve, reject) => {
      myBucket.deleteObject(params).send((err) => {
        if (err) {
          reject(err);
        } else {
          resolve("The event sketch is deleted.");
        }
      });
    });
  };

  const postToDatabase = async () => {
    const id = eventInfo[0]?.id;
    if (id === undefined) return;

    let isUploaded = imageUploaded;
    if (imageUploaded && !sketchFile) {
      await deleteFile();
      if (imageUploaded) isUploaded = false;
    } else if (sketchFile.size) {
      await uploadFile(sketchFile);
      if (!imageUploaded) isUploaded = true;
    }

    fetch(`/api/update_event/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "PUT",
      body: JSON.stringify({
        title,
        date,
        location,
        notes,
        imageUploaded: isUploaded,
      }),
    })
      .then((data) => data.json())
      .then((r) => {
        setTitle(r.title);
        setDate(r.date);
        setLocation(r.location);
        setNotes(r.notes);
        setImageUploaded(r.imageUploaded);
        setShowCreateEvent(false);
      });
  };

  const handleFileChange = (files) => {
    if (files) {
      setSketchFile(files[0]);
    } else {
      setSketchFile(null);
    }
  };

  return (
    <div className={styles.dimmer}>
      <div className={styles.container}>
        <Head>
          <title>Edit event | Observe</title>
        </Head>
        <div
          className={styles.closeButton}
          onClick={() => setShowCreateEvent(false)}
        >
          <FiX size={20} />
        </div>
        <div className={styles.title}>
          <h3>Edit event</h3>
        </div>
        <h4 className={styles.fieldTitle}>Event title</h4>
        <input
          className={styles.textInput}
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <h4 className={styles.fieldTitle}>Start date</h4>
        <input
          className={styles.textInput}
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
        <h4 className={styles.fieldTitle}>Location</h4>
        <input
          className={styles.textInput}
          type="text"
          onChange={(e) => setLocation(e.target.value)}
          value={location}
        />
        <h4 className={styles.fieldTitle}>Notes</h4>
        <input
          className={styles.textInput}
          type="text"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
        <div className={styles.fileSelectContainer}>
          <label className={styles.fileContainer}>
            <input
              className={styles.fileInput}
              type="file"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <BsImage />
            <p>{sketchFile ? sketchFile.name : "Upload event sketch"}</p>
          </label>
          {sketchFile && (
            <p className={styles.x} onClick={() => handleFileChange(null)}>
              <FiX />
            </p>
          )}
        </div>
        <div className={styles.createProject}>
          <div className={btnstyles.buttonCreate} onClick={postToDatabase}>
            UPDATE EVENT
          </div>
        </div>
        <Image
          className={styles.popupEllipse}
          src="/PopupEllipse.png"
          width={153}
          height={160}
          alt=""
        />
        <Image
          className={styles.popupPolygon}
          src="/PopupPolygon.png"
          width={104}
          height={240}
          alt=""
        />
      </div>
    </div>
  );
}

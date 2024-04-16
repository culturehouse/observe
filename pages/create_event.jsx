import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/create_event.module.css";
import btnstyles from "../styles/button.module.css";
import EventCode from "../lib/eventCode";
import { BsImage } from "react-icons/bs";
import { BiCopy } from "react-icons/bi";
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

export default function Events({
  setShowCreateEvent,
  project,
  setLoggedIn,
  setCanAccess,
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [sketch, setSketch] = useState(false);
  const [eventUploaded, setEventUploaded] = useState(false);
  const [eventUploadRes, setEventUploadRes] = useState({});
  const [imageUploaded, setImageUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showClipboard, setShowClipboard] = useState(false);
  const [postInProgress, setPostInProgress] = useState(false);
  const [eventCode, setEventCode] = useState("");

  const router = useRouter();

  const postToDatabase = () => {
    setPostInProgress(true);
    fetch(`/api/create_event/${eventCode}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
    })
      .then((data) => data.json())
      .then((r) => {
        fetch("/api/create_event/create_event", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
          body: JSON.stringify({
            title: title,
            date: date,
            location: location,
            eCode: r.eCode,
            id: project.id,
            notes: notes,
            npId: project.npId,
            np_sub: project.np_sub,
            imageUploaded: imageUploaded,
          }),
        })
          .then((data) => data.json())
          .then((res) => {
            setLoggedIn(res.loggedIn);
            setCanAccess(res.access);
            if (res.access && res.loggedIn) {
              uploadFile(sketch, res.newEvent.id);
              setEventUploaded(true);
              setEventUploadRes(res);
            }
            setPostInProgress(false);
          });
      });
  };

  const uploadFile = (file, id) => {
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      // CacheControl: "no-cache",
      // Expires: new Date(),
      Key: `events/${id}.png`, // replace events with either events, heatmaps, or projects
    };

    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImageUploaded(true);
      setSketch(e.target.files[0]);
    }
  };

  if (eventUploaded) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.border}>
          <div
            className={styles.closeButton}
            onClick={() => {
              window.location.reload();
            }}
          >
            <FiX size={20} />
          </div>
          <div className={styles.title}>
            <h3>{title}</h3>
          </div>
          <h4>Your unique event code: {eventCode}</h4>
          <p className={styles.italics}>
            Anyone with the code can add instances via the volunteer login
          </p>
          <h4>Share your event code below</h4>
          <div className={styles.flexRow}>
            <div className={styles.eventCode}>
              <h2>{eventCode}</h2>
              <div className={styles.buttonCode}>
                <div
                  className={btnstyles.buttonEdit}
                  onClick={() => {
                    navigator.clipboard.writeText(eventCode);
                    setShowClipboard(true);
                    setTimeout(() => {
                      setShowClipboard(false);
                    }, 3000);
                  }}
                >
                  <BiCopy />
                </div>
              </div>
            </div>
            {showClipboard ? (
              <p className={styles.copied}>Copied to clipboard!</p>
            ) : (
              <div className={styles.invisible} />
            )}
          </div>
          {imageUploaded ? <p>Image upload progress: {progress}%</p> : <></>}
          <p
            onClick={() => {
              router.push(
                `/view_event?id=${eventUploadRes.newEvent.id}&projId=${project["id"]}&projName=${project["name"]}`
              );
            }}
            className={btnstyles.buttonCreate}
          >
            SEE NEW EVENT
          </p>
        </div>
      </div>
    );
  }

  if (postInProgress) {
    // maybe add  && progress < 100 (so that image uploaded is part of loading)
    return (
      <div className={styles.container}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={styles.dimmer}>
      <div className={styles.container}>
        <div
          className={styles.closeButton}
          onClick={() => setShowCreateEvent(false)}
        >
          <FiX size={20} />
        </div>
        <div className={styles.title}>
          <h3>Create new event</h3>
        </div>
        <h4 className={styles.fieldTitle}>Event title</h4>
        <input
          className={styles.textInput}
          type="text"
          onChange={(e) => {
            setTitle(e.target.value);
            setEventCode(EventCode(title));
          }}
        />
        <h4 className={styles.fieldTitle}>Start date</h4>
        <input
          className={styles.textInput}
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />
        <h4 className={styles.fieldTitle}>Location</h4>
        <input
          className={styles.textInput}
          type="text"
          onChange={(e) => setLocation(e.target.value)}
        />
        <h4 className={styles.fieldTitle}>Notes</h4>
        <input
          className={styles.textInput}
          type="text"
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className={styles.fileSelectContainer}>
          <label className={styles.fileContainer}>
            <input
              className={styles.fileInput}
              type="file"
              checked={sketch}
              onChange={(e) => handleFileChange(e)}
            />
            <BsImage />
            <p>{sketch ? sketch.name : "Add event sketch (.png)"}</p>
          </label>
          <p className={styles.x} onClick={() => setSketch(null)}>
            <FiX />
          </p>
        </div>
        <div className={styles.createProject}>
          <div
            className={btnstyles.buttonCreate}
            onClick={() => {
              postToDatabase();
            }}
          >
            CREATE EVENT
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

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import styles from "../styles/create_event.module.css";
import btnstyles from "../styles/button.module.css";
import readFileAsDataURL from "../helpers/readFileAsDataURL";

export default function Events({ setShowCreateEvent, eventInfo = [] }) {
  const [title, setTitle] = useState(eventInfo[0]?.title ?? "");
  const [date, setDate] = useState(eventInfo[0]?.date ?? "");
  const [location, setLocation] = useState(eventInfo[0]?.location ?? "");
  const [notes, setNotes] = useState(eventInfo[0]?.notes ?? "");
  const [imageUploaded, setImageUploaded] = useState(
    eventInfo[0]?.imageUploaded ?? false
  );
  const [sketchFile, setSketchFile] = useState(
    eventInfo[0]?.imageUploaded ? { name: `${eventInfo[0]?.id}.png` } : null
  );

  const postToDatabase = async () => {
    const id = eventInfo[0]?.id;
    if (id === undefined) return;

    let isUploaded = imageUploaded;
    if (imageUploaded && !sketchFile) {
      const deleteRes = await fetch("/api/deleteImage", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "DELETE",
        body: JSON.stringify({ key: `events/${id}.png` }),
      });
      if (deleteRes.ok && imageUploaded) isUploaded = false;
    } else if (sketchFile.size) {
      const file = await readFileAsDataURL(sketchFile);
      const uploadRes = await fetch("/api/uploadImage", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "PUT",
        body: JSON.stringify({ key: `events/${id}.png`, file }),
      });
      if (uploadRes.ok) {
        // revalidatePath(
        //   `https://observe-images.s3.amazonaws.com/events/${id}.png`
        // );
        if (!imageUploaded) isUploaded = true;
      }
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

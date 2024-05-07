import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import { BiCopy } from "react-icons/bi";
import { FiX } from "react-icons/fi";
import styles from "../styles/create_event.module.css";
import btnstyles from "../styles/button.module.css";
import EventCode from "../lib/eventCode";
import readFileAsDataURL from "../helpers/readFileAsDataURL";

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
  const [sketch, setSketch] = useState(null);
  const [eventUploaded, setEventUploaded] = useState(false);
  const [eventUploadRes, setEventUploadRes] = useState({});
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
            title,
            date,
            location,
            notes,
            eCode: r.eCode,
            id: project.id,
            npId: project.npId,
            np_sub: project.np_sub,
          }),
        })
          .then((data) => data.json())
          .then(async (res) => {
            setLoggedIn(res.loggedIn);
            setCanAccess(res.access);

            const isCreated = res.loggedIn && res.access && res.newEvent?.id;
            if (isCreated) {
              setEventUploaded(true);
              setEventUploadRes(res);

              if (sketch) {
                const file = await readFileAsDataURL(sketch);
                const response = await fetch("/api/uploadImage", {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                  method: "PUT",
                  body: JSON.stringify({
                    key: `events/${res.newEvent.id}.png`,
                    file,
                  }),
                });

                if (response.ok) {
                  await fetch(`/api/update_event/${res.newEvent.id}`, {
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      "Access-Control-Allow-Origin": "*",
                    },
                    method: "PUT",
                    body: JSON.stringify({
                      imageUploaded: true,
                    }),
                  });
                }
              }
            }

            setPostInProgress(false);
          });
      });
  };

  const handleFileChange = (files) => {
    if (files) {
      setSketch(files[0]);
    } else {
      setSketch(null);
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
          {/* {sketch ? <p>Image upload progress: {progress}%</p> : <></>} */}
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
            <p>{sketch ? sketch.name : "Add event sketch (.png)"}</p>
          </label>
          {sketch && (
            <p className={styles.x} onClick={() => handleFileChange(null)}>
              <FiX />
            </p>
          )}
        </div>
        <div className={styles.createProject}>
          <div className={btnstyles.buttonCreate} onClick={postToDatabase}>
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

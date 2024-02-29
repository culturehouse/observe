import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../styles/view_event.module.css";
import ObserveLogo from "../components/ObserveLogo";
import btnstyles from "../styles/button.module.css";
import EditEvent from "./edit_event.jsx";
import Link from "next/link";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { BsCalendarEvent, BsChevronRight } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { BiCopy } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import CreateButton from "../components/CreateButton";
import Crumbs from "../components/Crumbs";
import LoadingPage from "../components/LoadingPage";
import PleaseLogin from "../components/PleaseLogin";
import NoAccess from "../components/NoAccess";
import BackgroundBottom3 from "../components/BackgroundBottom3";

export default function View_Event() {
  const [eventInfo, setEventInfo] = useState([{ title: "Loading..." }]);
  const [dataFetched, setDataFetched] = useState(false);
  const [showCreateEvent, setshowCreateEvent] = useState(false);
  const [heatmaps, setHeatmaps] = useState([]);
  const [firstHeatmapIndex, setFirstHeatmapIndex] = useState(0);
  const [showClipboard, setShowClipboard] = useState(false);
  const [coverImageURL, setCoverImageURL] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [canAccess, setCanAccess] = useState(false);

  const ref = useRef(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    fetch(`/api/view_event/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
    })
      .then((data) => data.json())
      .then(async (r) => {
        setLoggedIn(r.loggedIn);
        setCanAccess(r.access);
        if (r.loggedIn && r.access) {
          setEventInfo(r.events);
          setCoverImageURL(
            `https://culturehouse-images.s3.ap-northeast-2.amazonaws.com/events/${id}.png`
          );
          await fetch(`/api/view_event_heatmaps/${id}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            method: "GET",
          })
            .then((data) => data.json())
            .then((res) => {
              setHeatmaps(res);
            });
        }
        setDataFetched(true);
      });
  }, [router]);

  const convertDate = (heatmap) => {
    const date = heatmap.dateCreated;
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (!date || date.length == 0) return "";
    return `${months[parseInt(date.substring(5, 7)) - 1]} ${parseInt(
      date.substring(8, 10)
    ).toString()}, ${date.substring(0, 4)}`;
  };

  if (!dataFetched) {
    return <LoadingPage />;
  }

  if (!loggedIn) {
    return <PleaseLogin />;
  }

  if (!canAccess) {
    return <NoAccess />;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>View event | Observe</title>
      </Head>
      {showCreateEvent && (
        <div className={styles.edit_event}>
          <EditEvent
            setshowCreateEvent={setshowCreateEvent}
            eventInfo={eventInfo}
          />
        </div>
      )}
      <BackgroundBottom3 />
      <div className={styles.border} ref={ref}>
        <ObserveLogo />
        <div className={styles.crumbs}>
          <Crumbs
            crumbs={{
              proj: { name: router.query.projName, id: router.query.projId },
            }}
            ending={eventInfo[0] ? eventInfo[0]["title"] : ""}
          ></Crumbs>
        </div>
        <div className={styles.header}>
          <div className={styles.title}>
            <h1 className={styles.maintitle}>
              {eventInfo[0] ? eventInfo[0]["title"] : "undefined"}
            </h1>
          </div>
          <div className={styles.rightHeader}>
            <div className={styles.eventCode}>
              <h2>{eventInfo[0] ? eventInfo[0].eCode : "xx1234"}</h2>
              <div className={styles.buttonCode}>
                <div
                  className={btnstyles.buttonEdit}
                  onClick={() => {
                    navigator.clipboard.writeText(eventInfo[0].eCode);
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
            <div className={styles.editButton}>
              <div
                className={btnstyles.buttonEdit}
                onClick={() => {
                  setshowCreateEvent(!showCreateEvent);
                }}
              >
                <FiEdit2 />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.eventData}>
          <div className={styles.eventInform}>
            <div className={styles.eventInformRow}>
              <div className={styles.eventInfo}>
                <BsCalendarEvent />
                <p className={styles.text}>
                  {eventInfo[0] ? eventInfo[0]["date"] : "undefined"}
                </p>
              </div>
            </div>
            <div className={styles.eventInformRow}>
              <div className={styles.eventInfo}>
                <MdLocationOn />
                <p className={styles.text}>
                  {eventInfo[0] ? eventInfo[0]["location"] : "undefined"}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.noteSide}>
            <p className={styles.noteText}>
              {eventInfo[0] ? eventInfo[0]["notes"] : "undefined"}
            </p>
          </div>
        </div>
        <div className={styles.activityMappingContainer}>
          <h2 className={styles.maintitle}>Activity mapping</h2>
          <div className={styles.viewAll}>
            <div className={btnstyles.buttonUnder}>
              {id ? (
                <Link
                  href={`/instances?id=${id}&eventId=${
                    eventInfo[0] ? eventInfo[0]["id"] : ""
                  }&eventName=${
                    eventInfo[0] ? eventInfo[0]["title"] : ""
                  }&projId=${
                    router.query ? router.query.projId : ""
                  }&projName=${router.query ? router.query.projName : ""}`}
                  className={styles.link}
                >
                  View all instances
                  <BsChevronRight className={styles.chevron} />
                </Link>
              ) : (
                <Link href="instances?id=" className={styles.link}>
                  View all instances
                  <BsChevronRight className={styles.chevron} />
                </Link>
              )}
            </div>
          </div>
          <div className={styles.createButton}>
            {eventInfo[0] ? (
              <CreateButton
                id={eventInfo[0]["id"]}
                param={JSON.stringify(router.query)}
              />
            ) : (
              <CreateButton id="" />
            )}
          </div>
        </div>
        <div className={styles.heatmaps}>
          {firstHeatmapIndex > 0 ? (
            <div
              className={styles.activeGalleryButton}
              onClick={() => {
                setFirstHeatmapIndex(firstHeatmapIndex - 1);
              }}
            >
              <HiChevronLeft className={styles.galleryChevron} />
            </div>
          ) : (
            <div className={styles.inactiveGalleryButton}>
              <HiChevronLeft className={styles.galleryChevron} />
            </div>
          )}
          {heatmaps.length == 0 ? (
            <p className={styles.noHeatmaps}>
              No heatmaps created yet - create one by clicking the create
              button!
            </p>
          ) : (
            <div className={styles.invisible} />
          )}
          {heatmaps.map(function (heatmap, i) {
            console.log("heyo");
            if (i >= 3 + firstHeatmapIndex || i < 0 + firstHeatmapIndex) return;
            return (
              <Link
                href={`/heatmap?id=${heatmap.id}&eventId=${
                  eventInfo[0] ? eventInfo[0]["id"] : ""
                }&eventName=${
                  eventInfo[0] ? eventInfo[0]["title"] : ""
                }&projId=${router.query ? router.query.projId : ""}&projName=${
                  router.query ? router.query.projName : ""
                }`}
                className={styles.link}
              >
                <div className={styles.heatmap} key={i}>
                  <div className={styles.picturePlaceholder} />
                  <h4>{heatmap.name}</h4>
                  <p className={styles.heatmapDate}>
                    Created on {convertDate(heatmap)}
                  </p>
                  <div className={styles.numInstancesContainer}>
                    <p className={styles.numInstances}>
                      {heatmap.num_instances}
                    </p>
                    <p className={styles.numInstancesText}>Instances</p>
                  </div>
                </div>
              </Link>
            );
          })}
          {heatmaps.length === 1 && <div className={styles.hiddenHeatmap} />}
          {heatmaps.length !== 0 && heatmaps.length <= 2 && (
            <div className={styles.hiddenHeatmap} />
          )}
          {3 + firstHeatmapIndex < heatmaps.length ? (
            <div
              className={styles.activeGalleryButton}
              onClick={() => {
                setFirstHeatmapIndex(firstHeatmapIndex + 1);
              }}
            >
              <HiChevronRight className={styles.galleryChevron} />
            </div>
          ) : (
            <div className={styles.inactiveGalleryButton}>
              <HiChevronRight className={styles.galleryChevron} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import moment from "moment/moment";
import {
  BsClock,
  BsCalendarEvent,
  BsSun,
  BsThermometerHalf,
  BsPerson,
  BsArrowDown,
  BsArrowUp,
  BsChevronRight,
} from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Crumbs from "../components/Crumbs";
import ObserveLogo from "../components/ObserveLogo";
import CreateButton from "../components/CreateButton";
import NoAccess from "../components/NoAccess";
import PleaseLogin from "../components/PleaseLogin";
import LoadingPage from "../components/LoadingPage";
import BackgroundBottom2 from "../components/BackgroundBottom2";
import ConfirmDeleteInstance from "../components/ConfirmDeleteInstance";
import styles from "../styles/instances.module.css";

const orderType = {
  id: "id",
  dateTime: "dateTime",
  time: "time",
  weather: "weather",
  temperature: "temperature",
  volunteerName: "volunteerName",
};

export default function Instances() {
  const [orderBy, setOrderBy] = useState(orderType.dateTime);
  const [instances, setInstances] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const setOrderedInstances = (instances) => {
    const orderMult = sortAscending ? 1 : -1;
    const copy = [...instances];
    if (orderBy == orderType.temperature) {
      setInstances(copy.sort((a, b) => orderMult * (a[orderBy] - b[orderBy])));
    } else {
      setInstances(
        copy.sort((a, b) => orderMult * a[orderBy].localeCompare(b[orderBy]))
      );
    }
  };

  useEffect(() => {
    if (id) {
      fetch(`/api/instances/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "GET",
      })
        .then((data) => data.json())
        .then((r) => {
          setLoggedIn(r.loggedIn);
          setCanAccess(r.access);
          if (r.loggedIn && r.access) {
            setOrderedInstances(r.instances);
          }
          setLoading(false);
        });
    }
  }, [id]);

  const viewInstance = (id) => {
    if (deleting) return;
    router.push(
      `/view_instance?id=` +
        id +
        "&eventId=" +
        router.query.eventId +
        "&eventName=" +
        router.query.eventName +
        "&projId=" +
        router.query.projId +
        "&projName=" +
        router.query.projName
    );
  };

  const removeInstance = (id) => {
    if (deleting || !id) return;
    setDeleting(true);

    fetch(`/api/instances/delete_instance/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "DELETE",
    })
      .then((data) => data.json())
      .then((r) => {
        if (r.success) {
          setInstances((instances) =>
            instances.filter((instance) => instance.id !== id)
          );
        } else {
          alert(r.message);
        }
        setDeleting(false);
        setShowConfirmModal(false);
      });
  };

  const setTableOrder = (orderT) => {
    if (orderBy != orderT) {
      setSortAscending(true);
      setOrderBy(orderT);
    } else {
      setSortAscending(!sortAscending);
    }
  };

  if (loading) {
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
        <title>Observations | Observe</title>
      </Head>
      <BackgroundBottom2></BackgroundBottom2>
      <div className={styles.border}>
        <ObserveLogo />
        <div className={styles.backCreate}>
          <div className={styles.back}>
            <Crumbs
              crumbs={{
                event: {
                  id: router.query.eventId,
                  name: router.query.eventName,
                },
                proj: { id: router.query.projId, name: router.query.projName },
              }}
              ending={"Observations"}
            ></Crumbs>
          </div>
          <CreateButton id={id} param={JSON.stringify(router.query)} />
        </div>
        <h1 className={styles.maintitle}>Activity mapping</h1>
        <p className={styles.subtitle}>Observations</p>
        <div className={styles.table}>
          <div className={styles.headers}>
            {orderBy != orderType.id ? (
              <p
                className={styles.header}
                onClick={() => setTableOrder(orderType.id)}
              >
                #ID{" "}
                {orderBy == orderType.id &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            ) : (
              <p
                className={styles.activeHeader}
                onClick={() => setTableOrder(orderType.id)}
              >
                #ID{" "}
                {orderBy == orderType.id &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            )}
            {orderBy != orderType.dateTime ? (
              <p
                className={styles.header}
                onClick={() => setTableOrder(orderType.dateTime)}
              >
                <BsCalendarEvent /> Date{" "}
                {orderBy == orderType.dateTime &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            ) : (
              <p
                className={styles.activeHeader}
                onClick={() => setTableOrder(orderType.dateTime)}
              >
                <BsCalendarEvent /> Date{" "}
                {orderBy == orderType.dateTime &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            )}
            {orderBy != orderType.time ? (
              <p
                className={styles.header}
                onClick={() => setTableOrder(orderType.time)}
              >
                <BsClock /> Time{" "}
                {orderBy == orderType.time &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            ) : (
              <p
                className={styles.activeHeader}
                onClick={() => setTableOrder(orderType.time)}
              >
                <BsClock /> Time{" "}
                {orderBy == orderType.time &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            )}
            {orderBy != orderType.weather ? (
              <p
                className={styles.header}
                onClick={() => setTableOrder(orderType.weather)}
              >
                <BsSun /> Weather{" "}
                {orderBy == orderType.weather &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            ) : (
              <p
                className={styles.activeHeader}
                onClick={() => setTableOrder(orderType.weather)}
              >
                <BsSun /> Weather{" "}
                {orderBy == orderType.weather &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            )}
            {orderBy != orderType.temperature ? (
              <p
                className={styles.header}
                onClick={() => setTableOrder(orderType.temperature)}
              >
                <BsThermometerHalf /> Temperature{" "}
                {orderBy == orderType.temperature &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            ) : (
              <p
                className={styles.activeHeader}
                onClick={() => setTableOrder(orderType.temperature)}
              >
                <BsThermometerHalf /> Temperature{" "}
                {orderBy == orderType.temperature &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            )}
            {orderBy != orderType.volunteerName ? (
              <p
                className={styles.header}
                onClick={() => setTableOrder(orderType.volunteerName)}
              >
                <BsPerson /> Volunteer{" "}
                {orderBy == orderType.volunteerName &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            ) : (
              <p
                className={styles.activeHeader}
                onClick={() => setTableOrder(orderType.volunteerName)}
              >
                <BsPerson /> Volunteer{" "}
                {orderBy == orderType.volunteerName &&
                  (sortAscending ? <BsArrowUp /> : <BsArrowDown />)}
              </p>
            )}
            <div />
          </div>
          <div className={styles.rows}>
            {instances.length > 0 ? (
              instances.map((instance) => {
                return (
                  <div
                    key={instance.id}
                    className={styles.row}
                    onClick={() => {
                      viewInstance(instance.id);
                    }}
                  >
                    <p className={styles.idField}>{instance.id}</p>
                    <p className={styles.field}>
                      {moment(instance.dateTime).format("DD MMM,  YYYY")}
                    </p>
                    <p className={styles.field}>
                      {moment(instance.time, "hh").format("LT")}
                    </p>
                    <p className={styles.field}>{instance.weather}</p>
                    <p className={styles.field}>{instance.temperature + "˚F"}</p>
                    <p className={styles.field}>{instance.volunteerName}</p>
                    <div
                      className={styles.actionBtnContainer}
                      onClick={(e) => {
                        if (e && e.stopPropagation) e.stopPropagation();
                      }}
                    >
                      <BsChevronRight className={styles.rightArrow} />
                      <AiOutlineCloseCircle
                        className={styles.closeButton}
                        onClick={(e) => setShowConfirmModal(true)}
                      />
                      {showConfirmModal && (
                        <ConfirmDeleteInstance
                          setIsOpen={setShowConfirmModal}
                          handleConfirm={() => removeInstance(instance.id)}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.noInstances}>
                No observations yet - click "Create" -{">"} "New observation" to get
                started!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

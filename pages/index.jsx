import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { useUser } from '@auth0/nextjs-auth0/client';
import { auth } from "../services/auth0.service";
import LoadingPage from "../components/LoadingPage";
import CreateProject from "./create_project";
import styles from "../styles/home.module.css";
import btnstyles from "../styles/button.module.css";
import Image from "next/image";
import ObserveLogo from "../components/ObserveLogo";
import Link from "next/link";
import NoAccess from "../components/NoAccess";
import BackgroundBottom1 from "../components/BackgroundBottom1";

export default function Home() {
  const [NPData, setNPData] = useState([{ title: "Loading..." }]);
  const [dataFetched, setDataFetched] = useState(false);
  const [showHomePageP, setshowHomePageP] = useState(false);
  const [showHomePageL, setshowHomePageL] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [currTab, setTab] = useState("Current");
  const [creatingProject, setCreatingProject] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [canAccess, setCanAccess] = useState(false);

  const router = useRouter();
  const path = router.asPath;
  const hashArr = path.split("/");

  const processHash = (hash) => {
    auth.parseHash(
      {
        hash,
      },
      function (error, result) {
        if (error) {
          getPermission();
          return;
        }

        if (result) {
          const { accessToken } = result;
          if (accessToken) {
            auth.client.userInfo(accessToken, function (error, result) {
              if (error) {
                getPermission();
                return;
              }
              setCookies(accessToken);
            });
          }
        }
      }
    );
  };

  const setCookies = (accessToken) => {
    if (!dataFetched) {
      fetch(`/api/home/${accessToken}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "GET",
      })
        .then((data) => data.json())
        .then((r) => {
          if (!showHomePageL) {
            setshowHomePageL(true);
            setNPData(r);
            if (r.projects) setProjects(r.projects);
            setDataFetched(true);
            setLoggedIn(r.loggedIn);
            setCanAccess(r.dataFetched);
          }
          if (r.non_profit) {
            fetch(`/api/nonprofit_events/${r.non_profit[0].id}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              method: "GET",
            })
              .then((data) => data.json())
              .then((res) => {
                setEvents(res);
              });
          }
        });
    }
  };

  const getPermission = () => {
    fetch(`api/home/accessProjects`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
    })
      .then((data) => data.json())
      .then((r) => {
        if (!showHomePageP) {
          setshowHomePageP(true);
          setNPData(r);
          if (r.projects) setProjects(r.projects);
          setDataFetched(true);
          setLoggedIn(r.loggedIn);
          setCanAccess(r.dataFetched);
        }
        if (r.non_profit) {
          fetch(`/api/nonprofit_events/${r.non_profit[0].id}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            method: "GET",
          })
            .then((data) => data.json())
            .then((res) => {
              setEvents(res);
            });
        }
      });
  };

  const countEvents = (eventArr, projId) => {
    return eventArr.reduce(
      (acc, eventVal) => (eventVal.projectId == projId ? acc + 1 : acc),
      0
    );
  };

  // returns a JS object with .start and .end member variables. .empty is true if
  // no events are currently in the project
  const startAndEndDate = (project) => {
    let projEventDates = events.reduce(
      (acc, event) =>
        event.projectId == project.id ? [...acc, event.date] : acc,
      []
    );
    projEventDates = projEventDates.sort(function (a, b) {
      return Date.parse(a) > Date.parse(b);
    });

    let result = { empty: false, start: "", end: "" };
    let months = [
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

    if (projEventDates.length == 0) return { empty: true, start: "", end: "" };
    result.start =
      months[parseInt(projEventDates[0].substring(5, 7)) - 1] +
      " " +
      projEventDates[0].substring(0, 4);
    if (project.current) {
      result.end = "Present";
    } else {
      result.end =
        months[
          parseInt(projEventDates[projEventDates.length - 1].substring(5, 7)) -
            1
        ] +
        " " +
        projEventDates[projEventDates.length - 1].substring(0, 4);
    }

    return result;
  };

  useEffect(() => {
    if (!dataFetched) {
      if (hashArr[1] != "") {
        processHash(hashArr[1]);
      } else {
        getPermission();
      }
    }
  }, [hashArr]);

  const logout = () => {
    const res = fetch("/api/home/logout", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
    }).then((data) => {
      router.push("/login");
    });
  };

  if (!dataFetched || creatingProject) {
    return <LoadingPage />;
  }
  if (dataFetched) {
    if (!loggedIn) {
      router.push("/volunteer_login");
    } else if (NPData.dataFetched) {
      return (
        <div className={styles.container}>
          <Head>
            <title>Home | Observe</title>
          </Head>
          <BackgroundBottom1 />
          {showCreateProject && (
            <div className={styles.create_project}>
              <CreateProject
                setShowCreateProject={setShowCreateProject}
                nonprofitInfo={NPData}
                setLoggedIn={setLoggedIn}
                setCanAccess={setCanAccess}
                setCreatingProject={setCreatingProject}
              />
            </div>
          )}
          <div className={styles.border}>
            <ObserveLogo />
            <h1 className={styles.maintitle}>
              {NPData.non_profit[0].name}'s projects
            </h1>
            <div className={styles.create}>
              <p
                onClick={() => setShowCreateProject(true)}
                className={btnstyles.buttonCreate}
              >
                CREATE NEW PROJECT
              </p>
            </div>
            <div className={styles.logout}>
              <p
                onClick={() => {
                  logout();
                }}
                className={btnstyles.buttonLogout}
              >
                LOGOUT
              </p>
            </div>
            <div className={styles.tabs}>
              {currTab == "Past" ? (
                <p className={styles.activeTab} onClick={() => setTab("Past")}>
                  Past
                </p>
              ) : (
                <p
                  className={styles.inactiveTab}
                  onClick={() => setTab("Past")}
                >
                  Past
                </p>
              )}
              {currTab == "Current" ? (
                <p
                  className={styles.activeTab}
                  onClick={() => setTab("Current")}
                >
                  Current
                </p>
              ) : (
                <p
                  className={styles.inactiveTab}
                  onClick={() => setTab("Current")}
                >
                  Current
                </p>
              )}
              {currTab == "All" ? (
                <p className={styles.activeTab} onClick={() => setTab("All")}>
                  All
                </p>
              ) : (
                <p className={styles.inactiveTab} onClick={() => setTab("All")}>
                  All
                </p>
              )}
            </div>
            <div className={styles.projects}>
              {projects.map(function (proj, i) {
                let projdates = startAndEndDate(proj);
                let eventsDisplayed = 0;
                if (
                  (currTab == "Current" && proj.current) ||
                  (currTab == "Past" && !proj.current) ||
                  currTab == "All"
                )
                  return (
                    <Link
                      key={proj.id}
                      href={`/view_project?id=${proj.id}`}
                      className={styles.projectInfoLink}
                    >
                      <div className={styles.project} key={proj.id}>
                        <div className={styles.projectImageWrapper}>
                          {proj.imageUploaded ? (
                            <Image
                              className={styles.projectImage}
                              src={`https://culturehouse-images.s3.ap-northeast-2.amazonaws.com/projects/${proj.id}.png`}
                              height={200}
                              width={300}
                            />
                          ) : (
                            <Image
                              className={styles.projectImage}
                              src={`/defaultProject.png`}
                              height={200}
                              width={300}
                            />
                          )}
                          <div className={styles.events}>
                            {events.map(function (event, j) {
                              if (
                                event.projectId == proj.id &&
                                eventsDisplayed < 5
                              ) {
                                eventsDisplayed++;
                                return (
                                  <Link
                                    key={event.id}
                                    href={`/view_event?id=${event.id}&projName=${proj.name}&projId=${proj.id}`}
                                    className={styles.link}
                                  >
                                    <p key={event.id}>{event.title}</p>
                                  </Link>
                                );
                              }
                            })}
                          </div>
                        </div>

                        <div className={styles.projectInfo}>
                          <h3>{proj.name}</h3>
                          <p className={styles.projectDate}>
                            {projdates.empty
                              ? "Click me to access the project!"
                              : projdates.start + "–" + projdates.end}
                          </p>
                          <div className={styles.numInstancesContainer}>
                            <p className={styles.numInstances}>
                              {countEvents(events, proj.id)}
                            </p>
                            <p className={styles.numInstancesText}>events</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
              })}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <Head>
            <title>Home | Observe</title>
          </Head>
          <NoAccess />
        </>
      );
    }
  } else {
    return (
      <>
        <Head>
          <title>Home | Observe</title>
        </Head>
        <NoAccess />
      </>
    );
  }
}

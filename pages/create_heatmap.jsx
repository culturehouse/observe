import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import InstanceSelection from "../components/InstanceSelection";
import DensityGraphCreateHeatmap from "../components/DensityGraphCreateHeatmap";
import Crumbs from "../components/Crumbs";
import styles from "../styles/create_heatmap.module.css";
import other_styles from "../styles/heatmap.module.css";
import ObserveLogo from "../components/ObserveLogo";
import PleaseLogin from "../components/PleaseLogin";
import NoAccess from "../components/NoAccess";
import LoadingPage from "../components/LoadingPage";
import BackgroundBottom4 from "../components/BackgroundBottom4";

export default function Home() {
  const router = useRouter();
  const [dataTypeFilter, setDataTypeFilter] = useState([
    "sitting",
    "standing",
    "other",
  ]);
  const [filteredInstances, setFilteredInstances] = useState([]);
  const [selectedSet, setSelectedSet] = useState(new Set());
  const [heatmapData, setHeatmapData] = useState([]);
  const [name, setName] = useState("");
  const [filters, setFilters] = useState([]);
  const [instances, setInstances] = useState([]);
  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    if (!init && router.query.id) {
      setLoading(true);
      fetch(`/api/create_heatmap/${router.query.id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "GET",
      })
        .then((data) => data.json())
        .then((r) => {
          setCanAccess(r.validEvent);
          setLoggedIn(r.loggedIn);
          setLoading(false);

          if (!r.validEvent && !r.loggedIn) return;
          setInstances(r.data);
          setInit(true);
          setFilteredInstances(r.data);
        });
    }
  }, [init, router.query.id]);

  // Set heatmap data based on data type filter
  useEffect(() => {
    let newHeatmapData = filteredInstances
      .filter((instance) => selectedSet.has(instance.id))
      .reduce((accumulator, instance) => accumulator.concat(instance.data), []);
    if (dataTypeFilter.length !== 0) {
      newHeatmapData = newHeatmapData.filter((data) =>
        dataTypeFilter.includes(data.position)
      );
    }
    setHeatmapData(newHeatmapData);
  }, [filteredInstances, selectedSet, dataTypeFilter]);

  const createAggregateSNS = () => {
    if (instances.length == 0) {
      alert(
        "It isn't possible to create a heatmap without having any instances that belong to the event"
      );
      return;
    } else if (Array.from(selectedSet).length == 0) {
      alert("Please select at least one instance to create your heatmap");
      return;
    }

    setLoading(true);
    fetch("/api/create_heatmap/create_heatmap", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: JSON.stringify({
        data: heatmapData,
        instances: Array.from(selectedSet),
        filterQuery: filters.map((f) => JSON.stringify(f)),
        name: name,
        np_sub: instances[0].np_sub,
        eventId: router.query.id,
        num_instances: selectedSet.size,
        notes: "",
        dateCreated: new Date(),
        dateModified: new Date(),
      }),
    })
      .then((data) => data.json())
      .then((r) => {
        setLoading(false);
        if (!r.loggedIn) {
          alert("Heatmap was not created, please try again");
          return;
        } else if (!r.access) {
          alert("Heatmap was not created, please try again");
          setLoggedIn(true);
          return;
        }

        if (r.created) {
          alert("New heatmap successfully created!");
          router.push(
            `/heatmap?id=${r.new_heatmap.id}&eventId=${router.query.eventId}&eventName=${router.query.eventName}&projId=${router.query.projId}&projName=${router.query.projName}`
          );
        } else {
          alert("Heatmap was not created, please try again");
        }
      });
  };

  const { eventId } = router.query;
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
    <div
      style={{
        fontFamily: "var(--raleway, sans-serif)",
        backgroundColor: "rgb(248, 247, 243)",
        height: "100vh",
        paddingLeft: "3%",
        paddingRight: "3%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Head>
        <title>Create heatmap | Observe</title>
      </Head>
      <BackgroundBottom4></BackgroundBottom4>
      <div className={other_styles.border}>
        <div className={other_styles.container}>
          <div className={other_styles.logo}>
            <ObserveLogo></ObserveLogo>
          </div>
          <div className={other_styles.directory}>
            <Crumbs
              crumbs={{
                event: {
                  id: router.query.eventId,
                  name: router.query.eventName,
                },
                proj: { id: router.query.projId, name: router.query.projName },
              }}
              ending={"Create heatmap"}
            ></Crumbs>
          </div>
          <div className={other_styles.topSpace}></div>
          <h2 style={{ fontWeight: 700, fontSize: 25 }}>Select instances</h2>
          <div style={{ display: "flex" }}>
            <div style={{ width: "65%", display: "relative" }}>
              <InstanceSelection
                instances={instances}
                filteredInstances={filteredInstances}
                setFilteredInstances={setFilteredInstances}
                selectedSet={selectedSet}
                setSelectedSet={setSelectedSet}
                setDataTypeFilter={setDataTypeFilter}
                filters={filters}
                setFilters={setFilters}
                show={false}
              />
            </div>
            <div
              style={{
                marginTop: "50px",
                marginLeft: "4%",
                width: "30%",
                height: "400px",
              }}
            >
              <input
                type="text"
                placeholder="Heatmap name"
                style={{
                  border: "1px solid #58595B",
                  display: "flex",
                  alignSelf: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  fontFamily: "var(--raleway, sans-serif)",
                  fontStyle: "normal",
                  fontSize: "18px",
                  fontWeight: "400px",
                  width: "100%",
                  height: "34px",
                  padding: "20px",
                  borderRadius: 30,
                  position: "relative",
                  zIndex: "5",
                }}
                onChange={(e) => setName(e.target.value)}
              ></input>
              <h3
                style={{
                  paddingTop: 28,
                  paddingBottom: 12,
                  fontSize: 25,
                  fontWeight: 700,
                }}
              >
                Heatmap preview
              </h3>
              {/* this needs changing */}
              <Image
                className={styles.backgroundImage}
                src={`https://observe-images.s3.amazonaws.com/events/${eventId}.png`}
                height={350}
                width={350}
              />
              <div className={styles.heatmapCon}>
                <DensityGraphCreateHeatmap
                  data={heatmapData}
                  width={350}
                  height={350}
                />
              </div>
            </div>
          </div>
          <div className={other_styles.instanceText}>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: "8px",
              }}
            >
              You have selected{" "}
              <span
                style={{
                  background: "rgba(141, 190, 64, 0.5)",
                  borderRadius: 30,
                  paddingTop: 4,
                  width: 26,
                  height: 26,
                  display: "inline-block",
                  textAlign: "center",
                  marginLeft: 5,
                  marginRight: 5,
                  marginTop: 0,
                }}
              >
                {selectedSet.size}
              </span>
              {"  "}
              instances
            </p>
            <div className={other_styles.bottom}>
              <div
                className={other_styles.buttonCreate}
                onClick={() =>
                  router.push(
                    `/view_event?id=${router.query.eventId}&projId=${router.query.projId}&projName=${router.query.projName}`
                  )
                }
              >
                CANCEL
              </div>
              <div className={other_styles.buttonSpacing}></div>
              <div
                className={other_styles.buttonCreate}
                onClick={() => createAggregateSNS()}
              >
                CREATE HEATMAP
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

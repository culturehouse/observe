import Head from "next/head";
import DensityGraphViewHeatmap from "../components/DensityGraphViewHeatmap";
import styles from "../styles/heatmap.module.css";
import { useState, useEffect, useRef } from "react";
import btnstyles from "../styles/button.module.css";
import { jsPDF } from "jspdf";
import InstanceSelection from "../components/InstanceSelection";
import Crumbs from "../components/Crumbs";
import { useRouter } from "next/router";
import ObserveLogo from "../components/ObserveLogo";
import LoadingPage from "../components/LoadingPage";
import NoAccess from "../components/NoAccess";
import PleaseLogin from "../components/PleaseLogin"
import BackgroundBottom2 from "../components/BackgroundBottom2"

export default function Heatmap() {
  const [aggregateDataInstances, setAggregateDataInstances] = useState([]);
  const [hmap, setHmap] = useState([]);
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [canAccess, setCanAccess] = useState(false)
  const [backgroundLink, setBackgroundLink] = useState(
    "https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_square_large.gif"
  );
  console.log("testing change, hopefully fixes prod");

  const router = useRouter()
  var id;
  if (typeof window !== "undefined") {
    const queryParameters = new URLSearchParams(window.location.search);
    id = queryParameters.get("id");
  }
  const [dataTypeFilter, setDataTypeFilter] = useState([
    'sitting',
    'standing',
    'other',
  ]);

  const [notes, setNotes] = useState("");
  const [filteredInstances, setFilteredInstances] = useState([]);
  const [selectedSet, setSelectedSet] = useState(new Set());
  const [showInstances, setshowInstances] = useState(false);
  const [heatmapInfo, setHeatmapInfo] = useState([{ title: "Loading..." }]);
  const [dataFetched, setDataFetched] = useState(false);
  const [includeInfo, setIncludeInfo] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [init, setInit] = useState(false);
  const [heatmapData, setHeatmapData] = useState([])
  const [filters, setFilters] = useState([])

  const dateModifier = (dateString) => {
    let [date, time] = dateString.split("T")
    let [year, month, day] = date.split("-")
    let finalDate = month + "." + day + "." + year + " | "
    time = time.replace("Z", "")
    let [hour, minutes] = time.split(":")

    hour = (hour - 4 < 1 ? hour - 4 + 24 : hour - 4)
    let am_pm = (hour < 12 || hour == 24 ? " AM" : " PM")
    hour = (hour > 12 ? hour - 12 : hour)
    let finalHour = hour + ":" + minutes +  am_pm
    return finalDate + finalHour
  }

  const postToDatabase = () => {
    let newHeatmapData = filteredInstances
      .filter((instance) => selectedSet.has(instance.id))
      .reduce((accumulator, instance) => accumulator.concat(instance.data), []);
    if (dataTypeFilter.length != 0) {
      console.log(dataTypeFilter)
      newHeatmapData = newHeatmapData.filter((data) => {
        console.log(data.position)
        return dataTypeFilter.includes(data.position)
      }
      );
    }
    console.log(newHeatmapData)

    const _ = fetch(`/api/heatmap/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "PUT",
      body: JSON.stringify({
        data: newHeatmapData,
        notes: notes,
        instances: Array.from(selectedSet),
        filterQuery: filters.map((f) => JSON.stringify(f)),
        num_instances: selectedSet.size,
        dateModified: new Date(),
      }),
    }).then((r) => console.log(r));
    window.location.reload(false);
  };

  const postSmallEdit = () => {
        const _ = fetch(`/api/heatmap/heatmap_s/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "PUT",
      body: JSON.stringify({
        notes: notes,
        dateModified: new Date(),
      }),
    }).then((r) => console.log(r));
    window.location.reload(false);
  }

  useEffect(() => {
    console.log(Array.from(selectedSet))
      fetch(`api/heatmap/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "GET",
      })
        .then((data) => data.json())
        .then((r) => {
          setLoggedIn(r.loggedIn)
          setCanAccess(r.access)
          if (r.loggedIn && r.access) {
            setHeatmapInfo(r.aggregateSNS);
            if (r.aggregateSNS) {
              setDataFetched(true);
              setHmap(r.aggregateSNS.data);
              console.log("OUR DATA")
              console.log(hmap)
              setNotes(r.aggregateSNS.notes)
              setBackgroundLink(
                `https://culturehouse-images.s3.ap-northeast-2.amazonaws.com/events/${r.aggregateSNS.eventId}.png?cache_bust=${Math.floor(Math.random() * 100)}`
              );
            }
            fetch(`api/instances/${r.aggregateSNS.eventId}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              method: "GET",
            })
              .then((data) => data.json())
              .then((r) => {
                setAggregateDataInstances(r.instances);
                setFilteredInstances(r.instances);
                setInit(true);
                console.log("Data Instances")
                console.log(aggregateDataInstances)
              });
          }
          console.log("Current Situation")
          console.log(filteredInstances)
          console.log(selectedSet)
          let newHeatmapData = filteredInstances
            .filter((instance) => selectedSet.has(instance.id))
            .reduce((accumulator, instance) => accumulator.concat(instance.data), []);
          if (dataTypeFilter.length !== 0) {
            newHeatmapData = newHeatmapData.filter((data) =>
              dataTypeFilter.includes(data.position)
            );
          }
          console.log(newHeatmapData)
          setHeatmapData(newHeatmapData)
          setLoading(false);
        });  
  }, [router]);

  const svgWrapperRef = useRef(null);

  const filterProcessing = (filter) => {
    let jsonFilter = JSON.parse(filter)
    if (jsonFilter.type == "weather") {
      return "Instances that were collected during " + jsonFilter.selected[0].toLowerCase() + " weather"
    } else if (jsonFilter.type == "temperature") {
      return "Instances that had temperatures between " + jsonFilter.start + "°F and " + jsonFilter.end + "F°"
    } else if (jsonFilter.type == "time") {
      return "Instances that were collected between " + jsonFilter.start + " and " + jsonFilter.end
    } else if (jsonFilter.type == "volunteerName") {
      return "Instances that were collected by " + jsonFilter.selected.join(", ")
    }
  }

  const pdfGenerate = async () => {
    // TODO need to get this function working but commenting it out for now
    // so we can PR

    var doc = new jsPDF({
      orientation: "portrait",
    });

    doc.setFontSize(43);
    doc.line(20, 20, 200, 20);
    doc.text(20, 15, (heatmapInfo ? heatmapInfo["name"] : "Undefined"));
    doc.roundedRect(30, 28.32, 150, 150, 10, 10, "S");

    const svg = svgWrapperRef.current.querySelector("svg");
    const clonedSvg = svg.cloneNode(true);
    const backgroundImageNode = clonedSvg.querySelector('image[alt="background sketch"]');
    backgroundImageNode.remove();

    const backgroundImagePromise = (async () => {
      if (backgroundLink.includes('culturehouse-images')) {
        const r = await fetch(backgroundLink + '?cache_bust=' + Math.floor(Math.random() * 100));
        if (!r.ok) throw new Error('bad image');
        const backgroundImageData = await r.arrayBuffer();
        return new Uint8Array(backgroundImageData);
      }
    })().catch(() => null);
    const canvasImagePromise = new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = parseInt(clonedSvg.getAttribute("width"));
      canvas.height = parseInt(clonedSvg.getAttribute("height"));
      const image = new window.Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
        const png = canvas.toDataURL("image/png");
        resolve(png);
      };
      image.src = 'data:image/svg+xml;base64,' + btoa(clonedSvg.outerHTML);
    }).catch(() => null);

    const [backgroundImageData, canvasImageData] = await Promise.all([backgroundImagePromise, canvasImagePromise]);

    if (backgroundImageData) {
      doc.addImage(backgroundImageData, "PNG", 30, 28.32, 150, 150);
    }
    if (canvasImageData) {
      doc.addImage(canvasImageData, "PNG", 30, 28.32, 150, 150);
    }

    doc.setFontSize(20.5);
    // doc.text(56.24, 158.01, "Generated by CultureHouse");
    if (includeInfo) {
      doc.text(11.55, 200, "Heatmap information");
      doc.setFontSize(15.4);
      doc.text(17.22, 215.41, "Date created: " + (heatmapInfo ? heatmapInfo["dateCreated"] : "undefined"));
      doc.text(17.22, 224.4, "Date modified: " + (heatmapInfo ? heatmapInfo["dateModified"] : "undefined"));
      doc.text(17.22, 233.39, "Number of instances: " + (heatmapInfo ? heatmapInfo["num_instances"] : "undefined"));
      doc.text(17.22, 242.37, "Filters applied: " + 
      (heatmapInfo["filterQuery"]
        ? heatmapInfo["filterQuery"].map((filter) => filterProcessing(filter)).join(". ")
        // filterProcessing(heatmapInfo["filterQuery"][0])
        : "undefined"));
    }
    if (includeNotes) {
      doc.setFontSize(20.5);
      doc.text(11.55, 264.78, "Notes: " + notes);
    }

    doc.save(`${heatmapInfo ? heatmapInfo["name"] : "Undefined"}.pdf`);
  };

  if (loading) {
    return <LoadingPage />
  }

  if (!loggedIn) {
    return <PleaseLogin></PleaseLogin>
  }

  if (!canAccess) {
    return <NoAccess />
  }

  return (
    <div className={styles.border}>
      <Head>
        <title>
          View and edit heatmap | Observe
        </title>
      </Head>
      {showInstances && (
        <div className={styles.instances}>
          <InstanceSelection
            instances={aggregateDataInstances}
            filteredInstances={filteredInstances}
            setFilteredInstances={setFilteredInstances}
            selectedSet={selectedSet}
            setSelectedSet={setSelectedSet}
            setshowCreateEvent={setshowInstances}
            setDataTypeFilter={setDataTypeFilter}
            setShow={setshowInstances}
            show={showInstances}
            filters={filters}
            setFilters={setFilters}
            post={postToDatabase}
            dataTypeFilter={dataTypeFilter}
            setHeatmapData={setHeatmapData}
          />
        </div>
      )}
      <div className={styles.container}>
       
        <div className={styles.logo}>
             <ObserveLogo></ObserveLogo>
        </div>
        <BackgroundBottom2></BackgroundBottom2>
        <div className={styles.directory}>
          <Crumbs crumbs={{
            np: "",
            event: { id: router.query.eventId, name: router.query.eventName },
            proj: { id: router.query.projId, name: router.query.projName }
          }}
            ending={"View and edit heatmap"} >
          </Crumbs>
        </div>
        <div className={styles.title}>
          <h3>View and edit heatmap</h3>
        </div>
        <div className={styles.subtitle}>
          <h5>{heatmapInfo ? heatmapInfo["name"] : "undefined"}</h5>
        </div>
        <div className={styles.body}>
          <div className={styles.heatmapSide}>
            <div className={styles.key}>
              <div className={styles.myKey}></div>
            </div>
            <div className={styles.heatmapBox}>
              <div className={styles.heatmap}>
                <div className={styles.graph} ref={svgWrapperRef}>
                  <DensityGraphViewHeatmap data={hmap} width={480} height={480} backgroundLink={backgroundLink} />
                  {/* <DensityGraph data={hmap} width={480} height={480} backgroundLink={backgroundLink}/> */}
                </div>

                {/* <MyKey></MyKey> */}
              </div>
             
              {/* <div className={styles.fullscreen}>
              </div> */}
            </div>
          </div>

          {/* <div className={styles.key}><Key /></div> */}
          <div className={styles.infoSide}>
            <div className={styles.infoBox}>
              <div className={styles.titles}>
                <div className={styles.heatTitle}>
                  <h6>Heatmap information</h6>
                </div>
                <div className={styles.edit}>
                  <div
                    className={btnstyles.buttonUnder}
                    onClick={() => {
                      setshowInstances(!showInstances);
                    }}
                  >
                    Edit filters
                  </div>
                </div>
              </div>
              <div className={styles.heatInfoBox}>
                <div className={styles.heatInfo}>
                  <p>
                    <span className={styles.infoHeaders}>Date created:{" "}</span>
                    {heatmapInfo["dateCreated"] ? dateModifier(heatmapInfo["dateCreated"]) : "undefined"}{" "}
                  </p>{" "}
                  <br></br>
                  <p>
                    <span className={styles.infoHeaders}>Date modified:{" "}</span>
                    {heatmapInfo["dateModified"] ? dateModifier(heatmapInfo["dateModified"]) : "undefined"}{" "}
                  </p>{" "}
                  <br></br>
                  <p>
                    <span className={styles.infoHeaders}> Number of instances:{" "}</span>
                    {heatmapInfo ? heatmapInfo["num_instances"] : "undefined"}{" "}
                  </p>{" "}
                  <br></br>
                  <p>
                    {" "}
                    <span className={styles.infoHeaders}>Filters applied:{" "}</span>
                    {heatmapInfo["filterQuery"]
                      ? heatmapInfo["filterQuery"].map((filter) => filterProcessing(filter)).join(". ")
                      // filterProcessing(heatmapInfo["filterQuery"][0])
                      : "undefined"}{" "}
                  </p>
                </div>
              </div>
              <div className={styles.noteTitle}>
                <h6>Notes</h6>
              </div>
              <div className={styles.noteBox}>
                <div className={styles.note}>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={styles.noteBox}
                    rows={5}
                    cols={50}
                    placeholder={"Click here to take notes - don't forget to hit \"save\" afterwards!"}
                  ></textarea>
                </div>
              </div>
              <div className={styles.downloadTitle}>
                <h6>Download options</h6>
              </div>
              <div className={styles.downloadBox}>
                <div className={styles.checks}>
                  <div className={styles.checksTop}>
                    {/* <div className={styles.checksTop1}>
                      <h8>File Type</h8>
                    </div> */}
                    <div className={styles.checksTop2}>
                    <p className={styles.pdfHeader}>PDF</p>
                    </div>
                  </div>
                  <div className={styles.checksBottom}>
                    <div className={styles.checksBottom1}>
                      <div className={styles.checksBottom1a}>
                        <input
                          type="checkbox"
                          onClick={() => {
                            setIncludeInfo(!includeInfo);
                          }}
                        />
                      </div>
                      <div className={styles.checksBottom1b}>
                        Include heatmap information
                      </div>
                    </div>
                    <div className={styles.checksBottom2}>
                      <div className={styles.checksBottom1a}>
                        <input
                          type="checkbox"
                          onClick={() => {
                            setIncludeNotes(!includeNotes);
                          }}
                        />
                      </div>
                      <div className={styles.checksBottom1b}>Include notes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>

          {/* <div className={styles.scale}>
            <Image
              src={scale}
              height={50}
              width={200}
              style={{ alignSelf: "center" }}
            ></Image>
          </div> */}
          <div className={styles.empty}></div>
          <div className={styles.save}>
            <div className={styles.buttonCreate} onClick={postSmallEdit}>
              SAVE
            </div>
          </div>
          <div className={styles.download}>
            <div
              className={styles.buttonCreate}
              onClick={() => {
                pdfGenerate();
              }}
            >
              DOWNLOAD HEATMAP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

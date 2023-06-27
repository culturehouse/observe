
import Head from 'next/head'
import { useEffect } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import clientPromise from '../lib/mongodb'
import styles from "../styles/view_event.module.css"
import pstyles from "../styles/view_project.module.css"
//import styles from "../styles/create_project.module.css"
import Project from "./create_project.jsx"
import btnstyles from "../styles/button.module.css"
import Event from "./create_event.jsx"
import EditProject from "./edit_project.jsx"
import { useRouter } from 'next/router'
import Link from 'next/link'
import LoadingPage from '../components/LoadingPage'
import ObserveLogo from '../components/ObserveLogo'

import { RiCalendar2Fill } from "react-icons/ri"
import { MdLocationOn } from "react-icons/md"
import { RxPlus } from "react-icons/rx"
import { RiPencilLine } from "react-icons/ri"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { BiMapPin } from "react-icons/bi"
import Crumbs from "../components/Crumbs"
import PleaseLogin from "../components/PleaseLogin"
import NoAccess from '../components/NoAccess'
import BackgroundBottom2 from '../components/BackgroundBottom2'

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

// function date(eventInfo){
//   const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//   let date = eventInfo[0]["date"];

//   let month = date.substring(6,8);
  
//   let theMonth = months[month - 1];

//   let day = eventInfo[0]["date"];
// }

export default function View_Project({isConnected}) {
  const [projectInfo, setProjectInfo] = useState([{"name": "Loading..."}]);
  const [dataFetched, setDataFetched] = useState(false);
  const [attachFiles, setAttachFiles] = useState(false);
  const [showCreateEvent, setshowCreateEvent] = useState(false);
  const [eventInfo, setEventInfo] = useState([{"title": "Loading..."}]);
  const [current, setCurrent] = useState(true);
  const [eventsFetched, setEventsFetched] = useState(false);


  const [showEditProject, setshowEditProject] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startIndex, setStartIndex] = useState(-1)
  const [loggedIn, setLoggedIn] = useState(true)
  const [canAccess, setCanAccess] = useState(true)
  const router = useRouter();

  function truncate(str, n) {
    return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
  };




  const date = new Date(); 
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${month}/${day}/${year}`
  console.log(router.query)

  let cdate;
  let parsedDate;
  let displayDate;
  
  if (eventInfo.length != 0 && eventInfo[0].title != "Loading...") {
    cdate = eventInfo[0]["date"];
    parsedDate = cdate.toString().split('-');
    displayDate = `${parsedDate[1]}/${parsedDate[2]}/${parsedDate[0]}`;
  } else {
    displayDate = "No Starting Date Yet";
  }

  const goToEvent = (event) => {
    router.push(`/view_event?id=${event.id}&projId=${projectInfo[0]["id"]}&projName=${projectInfo[0]["name"]}`)
  }
  
  const clickLeft = () => {
    setStartIndex(startIndex - 1)
  }

  const clickRight = () => {
    setStartIndex(startIndex + 1)
  }

  const convertDate = (event) => {
    let date = event.date;
    console.log(date);
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                  'August', 'September', 'October', 'November', 'December'];
    if (!date || date.length == 0) return "";
    return months[parseInt(date.substring(5, 7)) - 1] + " "
                   + parseInt(date.substring(8, 10)).toString() + ", " 
                   + date.substring(0, 4);
  }
  
  let updatedList = eventInfo.slice(( startIndex == -1 ? 0 : startIndex), startIndex + 3).map((event) => {
    console.log(event)
    console.log(startIndex)
    return (
      <div className={pstyles.eventCon} onClick={() => goToEvent(event)}>
        <div className={pstyles.event}>
      <div className={pstyles.eventName}>
        <p>{truncate(event.title, 28)}</p>
      </div>
      <div className={pstyles.eventInfo}>
        {/* {  const start = new Date().toLocaleDateString(event);} */}
        {<RiCalendar2Fill/>} {event ? convertDate(event) : "undefined"}
        <br></br> <br></br>
        {<MdLocationOn/>}{event ? event["location"] : "undefined"}
      </div>
    </div>
      </div>
    )
  })
  
  //const [headerImage, setHeaderImage] = useState();

  var id;
  if (typeof window !== "undefined") {
    const queryParameters = new URLSearchParams(window.location.search);
    id = queryParameters.get("id");
  }

  const putToDatabase = async () => {
    let currentBool = !current;
    setCurrent(!current);
    const response = await fetch(`/api/view_project/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      method: 'PUT',
      body: JSON.stringify({
        current: currentBool,
      }),
    }).then((data) => data.json()).then((r) => {
      setLoggedIn(r.loggedIn)
      setCanAccess(r.access)
    });
  }

  useEffect (() => {
    if (!dataFetched) {
      const response = fetch(`/api/view_project/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        method: 'GET',
      }).then((data) => data.json()).then((r) => 
      {
        setLoggedIn(r.loggedIn)
        setCanAccess(r.access)
        if (r.loggedIn && r.access) {
          setProjectInfo(r.projects);
          if (r.projects[0] !== undefined) {
            setCurrent(r.projects[0].current);
            setName(r.projects[0].name);
            setDescription(r.projects[0].description);
            const event_response = fetch(`/api/view_project_events/${id}`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
              method: 'GET',
            }).then((data) => data.json()).then((r) => {
              if (!dataFetched) {
                setEventInfo(r);
                setDataFetched(true);
              }
            });
          }
        }
        setDataFetched(true);
      });
    }
  },[router, eventInfo]);

  if (!loggedIn) {
    return <PleaseLogin></PleaseLogin>
  }

  if (!canAccess) {
    return <NoAccess/>
  }

  if (!dataFetched) {
    return (<LoadingPage></LoadingPage>)
  }
  //on the line with EditProject, you also have to pass in an id so that in the
  // edit project page it can update the specific project in the database
  console.log(projectInfo, eventInfo);
  return (
  <div className={pstyles.container}>
    <Head>
      <title>
        View project | Observe
      </title>
    </Head>
    {showCreateEvent && <div className={pstyles.createEventPopup}> 
        <Event setshowCreateEvent={setshowCreateEvent} project={projectInfo[0]} setLoggedIn={setLoggedIn} setCanAccess={setCanAccess} />
    </div>}
    {showEditProject && <div className={pstyles.createEventPopup}> 
      <EditProject setshowEditProject={setshowEditProject} id={id} setLoggedIn={setLoggedIn} setCanAccess={setCanAccess}/>
    </div>}
      <BackgroundBottom2></BackgroundBottom2>
    {/* <Image className={pstyles.tri}
        src={"/projectTriangle.png"}
        height={400}
        width={400}
        style={{ alignSelf: 'center' }}
    />
    <Image className={pstyles.hex}
        src={"/projectHexagon.png"}
        height={400}
        width={200}
        style={{ alignSelf: 'center' }}
    /> */}
    <div className={pstyles.border}>
        <div className={pstyles.title}> <ObserveLogo></ObserveLogo></div>
      {/* <div className ={pstyles.wrapArrow}>
        <div className={pstyles.arrow}> */}
        <div className={pstyles.crumbs}>
          <Crumbs crumbs={{np: true}} ending={projectInfo[0] ? projectInfo[0]["name"] : ""}></Crumbs>
        </div>
       {/* </div>  
         □ / <div className={pstyles.directoryName}>{projectInfo[0] ? projectInfo[0]["name"] : "undefined"}</div> 
      </div>  */}
      <div className={pstyles.middle}> 
      <div className={pstyles.pImage}> 
        { projectInfo[0].imageUploaded ?
        <Image className={pstyles.picture}
          src={`https://culturehouse-images.s3.ap-northeast-2.amazonaws.com/projects/${projectInfo[0].id}.png`}
          height={320}
          width={585}
        />  
        :
        <Image className={pstyles.picture}
          src={`/defaultProject.png`}
          height={320}
          width={585}
          style={{ alignSelf: 'center' }}
        />  
        }
      </div>
      <div className={pstyles.middleRight}>
        <div className={pstyles.pHeading}>
          <div className={pstyles.pTitle}>
            {projectInfo[0] ? projectInfo[0]["name"] : "undefined"}
          </div>
          <div className={pstyles.circle} onClick={() => {setshowEditProject(!showEditProject)}}>
              <div className={pstyles.pencil}>
                < RiPencilLine/>
              </div>
          </div>
        </div>
        <div className={pstyles.currentButton}>
          <select name="Set Current" onChange={() => {putToDatabase()}}>
                {current ? <option selected> &nbsp;Current</option> :  <option>Current</option>}
                {!current ? <option selected> &nbsp;Past</option> :  <option >Past</option>}
          </select>
        </div>
        <div className={pstyles.pInfo}>
          <div className={pstyles.pCal}>
            {<RiCalendar2Fill/>}    
            <div className={pstyles.pDate}>
              {eventInfo[0] ? displayDate : "No start date yet! "} 
              –{current ? current : currentDate}{!current ? !current : "Present"}
            </div>
          </div>
          <div className={pstyles.pDescript}>
            <p>{projectInfo[0] ? projectInfo[0]["description"] : "UNDEFINED"}</p>
          </div>
        </div>
      </div>
    </div>
    <div className={pstyles.eInfo}>
      Project events
      <div className={pstyles.events}>
        {startIndex != -1 ? 
          <span className={pstyles.clicky} onClick={() => { clickLeft() }}>
            <HiChevronLeft className={pstyles.activeArrow}/>
          </span>
           :
          <span className={pstyles.noclicky}>
            <HiChevronLeft className={pstyles.inactiveArrow}/>
          </span>
        }
       
       
        <div className={pstyles.eventsCon}>
              {startIndex == -1 ?
                <div className={pstyles.createEvent} onClick={() => { setshowCreateEvent(!showCreateEvent) }}>
                  <div className={pstyles.plus}>
                    <RxPlus />
                  </div>
                  Create new event
                </div>
                :
                <></>
              }
          {updatedList}
          {eventInfo.length < 1 ?
                <div className={pstyles.eventCon}>
                  <div className={pstyles.hiddenEvent}>
                  </div>
                </div>
            :
            <></>
          }
          {eventInfo.length < 2 ?
            <div className={pstyles.eventCon}>
              <div className={pstyles.hiddenEvent}>
              </div>
            </div>
            :
            <></>
          }
              
        </div>
            {
              startIndex < eventInfo.length - 3 ?
                <div className={pstyles.clicky} onClick={() => { clickRight() }}>
                  <HiChevronRight className={pstyles.activeArrow}/>
                </div>
                :
                <div className={pstyles.noclicky}>
                  <HiChevronRight className={pstyles.inactiveArrow}/>
                </div>
            }
            
      </div>
    </div>
    </div>
  </div>

  )
}


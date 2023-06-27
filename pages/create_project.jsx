import clientPromise from '../lib/mongodb'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from "../styles/create_event.module.css"
import culturehouse_logo from "../images/culturehouse_logo.png" 
import btnstyles from "../styles/button.module.css"
import Image from 'next/image'
import { RouterProvider } from 'react-router-dom'
import { BsImage } from "react-icons/bs"
import { FiX } from "react-icons/fi"
import LoadingPage from "../components/LoadingPage"
import Head from 'next/head'

import AWS from 'aws-sdk'

const S3_BUCKET ='culturehouse-images';
const REGION ='ap-northeast-2';


AWS.config.update({
    accessKeyId: 'AKIA2AAODY6NWVHHAZ4B',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

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

export default function Projects({isConnected, setshowCreateProject, nonprofitInfo, 
                                  setLoggedIn, setCanAccess, setCreatingProject}) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    // const [headerImage, setHeaderImage] = useState(false);
    const [ projectImage, setProjectImage ] = useState(null);
    const [ imageUploaded, setImageUploaded ] = useState(false);
    const [progress , setProgress] = useState(0);
    const [date, setDate] = useState("");
    const [ postInProgress, setPostInProgress ] = useState(false);

    const router = useRouter();
    // useEffect(() => {
    //   fetch('../public/defaultProject.png')
    //       .then(res => res.blob()) // Gets the response and returns it as a blob
    //       .then(blob => {
    //         // Here's where you get access to the blob
    //         // And you can use it for whatever you want
    //         // Like calling ref().put(blob)

    //         // Here, I use it to make an image appear on the page
    //         let projectFile = new File([blob], "defaultProject.png")
    //         setProjectImage(projectFile);
    //     });
    //   })

    const postToDatabase = async () => {
      setPostInProgress(true);
      const response = await fetch("/api/create_project/create_project", {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        method: 'POST',
        body: JSON.stringify({
          name: name,
          description: description,
          npId: nonprofitInfo.non_profit[0].id,
          np_sub: nonprofitInfo.non_profit[0].np_sub, 
          imageUploaded: imageUploaded,
        }),
      }).then((data) => data.json()).then((r) => {
        if (!r.loggedIn) {
          setLoggedIn(false)
        } else if (!r.canAccess) {
          setLoggedIn(true);
          setCanAccess(false)
        }
        setLoggedIn(true)
        setCanAccess(true)
        console.log(r.newProject)
        uploadFile(projectImage, r.newProject.id).then(() => {
          router.push("/view_project?id=" + r.newProject.id)
          // console.log("would rediret now!");
        });
      });
      ;
    }

    const uploadFile = (file, id) => {

      const params = {
          ACL: 'public-read',
          Body: file,
          Bucket: S3_BUCKET,
          CacheControl: "no-cache",
          Expires: new Date(),
          Key: 'projects/' + id + '.png' // replace events with either events, heatmaps, or projects
      };

      return new Promise((resolve, reject) => {
        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) {
                  console.error(err);
                  reject(err);
                } else {
                  resolve();
                }
            });
      })
    }

  const handleFileChange = (e) => {
    // console.log("handling file change")
    if (e.target.files) {
      setImageUploaded(true);
      // console.log("recognized file")
      setProjectImage(e.target.files[0]);
    }
  };

  if (postInProgress) {
    // setCreatingProject(true);
    return (
      <LoadingPage />
    )
    // return (
    //   <div className={styles.container}>
    //     <h1>Creating project...</h1>
    //   </div>
    // );
  }

  return (
    <div className={styles.dimmer}>
      <div className={styles.container}>
        {/* <Head>
          <title>
            Create Project | Observe
          </title>
        </Head> */}
        <div className={styles.closeButton} onClick={() => {setshowCreateProject(false)}}><FiX size={20}/></div> 
        <br/><br/><br/> 
        <div className={styles.title}>
          <h3>Create new project</h3>
        </div>
        <br/><br/>
        <div className={styles.topHalfData}>
          <h4 className={styles.fieldTitle}>Project name</h4> 
          <input className={styles.textInput} type="text" onChange={(e) => setName(e.target.value)} value={name}/> <br/><br/> 
        </div>
        <div>
          {/* <h4 className={styles.fieldTitle}>Start date</h4> 
          <input className={styles.textInput} type="date" name="pdate" onChange={(e) => setDate(e.target.value)} /> <br/><br/> */}
          <h4 className={styles.fieldTitle}>Description</h4>
          <input className={styles.textInput} type="text" name = "pdescript" onChange={(e) => setDescription(e.target.value)}value={description}/> <br/><br/>
          <div className={styles.fileSelectContainer}>
              <label className={styles.fileContainer}>
                  {/* <input className={styles.fileInput} type="file" checked={sketch} onChange={(e) => setSketch(!sketch)}/> */}
                  <input className={styles.fileInput} type="file" checked={projectImage != null} onChange={(e) => handleFileChange(e)}/>
                  <BsImage />
                  <p>{projectImage != null ? projectImage.name : "Upload cover image (.png only)"}</p>
              </label>
              <p className={styles.x} onClick={() => {setImageUploaded(false); setProjectImage(null)}}><FiX /></p>
              {/* <div>File upload progress: {progress}%</div> */}
            </div>
          <br></br><br/>
        </div>
        <div className={styles.createProject}>
          <div className={btnstyles.buttonCreate} onClick={() => {postToDatabase()}}>CREATE PROJECT</div>
        </div> 
        <Image className={styles.popupEllipse} src="/PopupEllipse.png" width={153} height={160} alt=""/>
        <Image className={styles.popupPolygon} src="/PopupPolygon.png" width={104} height={240} alt=""/>
      </div>
    </div>
  )
}
import Head from 'next/head'
import { useState } from 'react'
import { useEffect } from 'react'
import styles from "../styles/create_event.module.css"
import btnstyles from "../styles/button.module.css"
import { BsImage } from "react-icons/bs"
import { FiX } from "react-icons/fi"

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

export default function Projects({setshowEditProject, id, setLoggedIn, setCanAccess}) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [projectInfo, setProjectInfo] = useState([{"Nonprofit": "Loading..."}]);
    const [dataFetched, setDataFetched] = useState(false);
    const [ coverFile, setCoverFile ] = useState(null);
    const [progress , setProgress] = useState(0);
    const [ imageUploaded, setImageUploaded ] = useState(false);

    
    // const [headerImage, setHeaderImage] = useState(false);
    // const [attachFiles, setAttachFiles] = useState(false);

    const postToDatabase = async () => {
      
    const edit_project_response = await fetch(`/api/edit_project/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        method: 'PUT',
        body: JSON.stringify({
          description: description,
          name: name,
          imageUploaded: imageUploaded,
          // headerImage: ,
        }),
      }).then((r) => console.log(r));
      uploadFile(coverFile).then(() => {
        window.location.reload(false);
      });
    }

    const uploadFile = (file) => {

      const params = {
          ACL: 'public-read',
          Body: file,
          Bucket: S3_BUCKET,
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
      // console.log("recognized file")
      setImageUploaded(true);
      setCoverFile(e.target.files[0]);
    }
  };

   
    useEffect (() => {
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
        setProjectInfo(r.projects);
        setName(r.projects[0].name);
        setDescription(r.projects[0].description);
        setDataFetched(true);
        setImageUploaded(r.projects[0].imageUploaded)
      });
    },[]);

    

  return (
    <div className={styles.dimmer}>
      <div className={styles.container}>
        <Head>
          <title>
            Edit Project | Observe
          </title>
        </Head>
        <div className={styles.circle}></div>
        <div className={styles.closeButton}>
        <div  onClick={() => {setshowEditProject(false)}}><FiX size={20}/></div> 
        </div> 
        <br/><br/><br/> 
        <div className={styles.title}>
          <h2>Edit project</h2>
        </div>
        <br/><br/>
        <div className={styles.topHalfData}>
          <h4 className={styles.fieldTitle}>Project title</h4> 
          <input className={styles.textInput} type="text" text={projectInfo[0]["name"]} onChange={(e) => setName(e.target.value)} value={name}/> <br/><br/> 
          {/* <h5>Start Date:</h5> <input type="date" onChange={(e) => setDate(e.target.value)} /> <br/><br/> */}
        </div>
        <h4 className={styles.fieldTitle}>Description</h4> 
        <div className={styles.input}>
          <input className={styles.textInput} type="text" text={projectInfo[0]["name"]} onChange={(e) => setDescription(e.target.value)}value={description}/> 
        </div>
        <br />
        <div className={styles.fileSelectContainer}>
              <label className={styles.fileContainer}>
                  {/* <input className={styles.fileInput} type="file" checked={sketch} onChange={(e) => setSketch(!sketch)}/> */}
                  <input className={styles.fileInput} type="file" checked={coverFile != null} onChange={(e) => handleFileChange(e)}/>
                  <BsImage />
                  <p>{coverFile != null ? coverFile.name : id + ".jpg"}</p>
              </label>
              <p className={styles.x} onClick={() => {console.log("bruh"); setCoverFile(null)}}><FiX /></p>
              {/* <div>Sketch upload progress is {progress}%</div> */}
            </div>
        <br /><br />
            
        <div className={styles.createProject}>
          <div className={btnstyles.buttonCreate} onClick={() => {postToDatabase()}}>SAVE CHANGES</div>
        </div> 
      </div>
    </div>
  )
      
}

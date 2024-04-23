import Head from "next/head";
import { useState } from "react";
import styles from "../styles/create_event.module.css";
import btnstyles from "../styles/button.module.css";
import { BsImage } from "react-icons/bs";
import { FiX } from "react-icons/fi";

import AWS from "aws-sdk";

const S3_BUCKET = "culturehouse-images";
const REGION = "ap-northeast-2";

AWS.config.update({
  accessKeyId: "AKIA2AAODY6NWVHHAZ4B",
  secretAccessKey: "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",
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export default function Projects({ setShowEditProject, projectInfo = [] }) {
  const [name, setName] = useState(projectInfo[0]?.name ?? "");
  const [description, setDescription] = useState(
    projectInfo[0]?.description ?? ""
  );
  const [imageUploaded, setImageUploaded] = useState(
    projectInfo[0]?.imageUploaded ?? false
  );
  const [coverFile, setCoverFile] = useState(
    projectInfo[0]?.imageUploaded ? { name: `${projectInfo[0]?.id}.jpg` } : null
  );
  const [progress, setProgress] = useState(0);

  const uploadFile = (file) => {
    const id = projectInfo[0]?.id;
    if (id === undefined) return;

    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      CacheControl: "no-cache",
      Expires: new Date(),
      Key: `projects/${id}.png`, // replace events with either events, heatmaps, or projects
    };

    return new Promise((resolve, reject) => {
      myBucket
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        })
        .send((err) => {
          if (err) {
            reject(err);
          } else {
            resolve("The project cover image is uploaded.");
          }
        });
    });
  };

  const deleteFile = () => {
    const id = projectInfo[0]?.id;
    if (id === undefined) return;

    const params = {
      Bucket: S3_BUCKET,
      Key: `projects/${id}.png`, // replace events with either events, heatmaps, or projects
    };

    return new Promise((resolve, reject) => {
      myBucket.deleteObject(params).send((err) => {
        if (err) {
          reject(err);
        } else {
          resolve("The project cover image is deleted.");
        }
      });
    });
  };

  const postToDatabase = async () => {
    const id = projectInfo[0]?.id;
    if (id === undefined) return;

    let isUploaded = imageUploaded;
    if (imageUploaded && !coverFile) {
      await deleteFile().then(() => {
        if (imageUploaded) isUploaded = false;
      });
    } else if (coverFile.size) {
      await uploadFile(coverFile).then(() => {
        if (!imageUploaded) isUploaded = true;
      });
    }

    fetch(`/api/edit_project/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "PUT",
      body: JSON.stringify({
        name,
        description,
        imageUploaded: isUploaded,
        // headerImage: ,
      }),
    })
      .then((data) => data.json())
      .then((r) => {
        setName(r.name);
        setDescription(r.description);
        setImageUploaded(r.imageUploaded);
        setShowEditProject(false);
      });
  };

  const handleFileChange = (files) => {
    if (files) {
      setCoverFile(files[0]);
    } else {
      setCoverFile(null);
    }
  };

  return (
    <div className={styles.dimmer}>
      <div className={styles.container}>
        <Head>
          <title>Edit Project | Observe</title>
        </Head>
        <div className={styles.circle}></div>
        <div className={styles.closeButton}>
          <div onClick={() => setShowEditProject(false)}>
            <FiX size={20} />
          </div>
        </div>
        <div className={styles.title}>
          <h3>Edit project</h3>
        </div>
        <h4 className={styles.fieldTitle}>Project title</h4>
        <input
          className={styles.textInput}
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <h4 className={styles.fieldTitle}>Description</h4>
        <input
          className={styles.textInput}
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <div className={styles.fileSelectContainer}>
          <label className={styles.fileContainer}>
            <input
              className={styles.fileInput}
              type="file"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <BsImage />
            <p>{coverFile ? coverFile.name : "Upload cover image"}</p>
          </label>
          {coverFile && (
            <p className={styles.x} onClick={() => handleFileChange(null)}>
              <FiX />
            </p>
          )}
        </div>
        <div className={styles.createProject}>
          <div className={btnstyles.buttonCreate} onClick={postToDatabase}>
            SAVE CHANGES
          </div>
        </div>
      </div>
    </div>
  );
}

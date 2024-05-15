import { useState } from "react";
import Head from "next/head";
import { BsImage } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import styles from "../styles/create_event.module.css";
import btnstyles from "../styles/button.module.css";
import readFileAsDataURL from "../helpers/readFileAsDataURL";

export default function Projects({ setShowEditProject, projectInfo = [] }) {
  const [name, setName] = useState(projectInfo[0]?.name ?? "");
  const [description, setDescription] = useState(
    projectInfo[0]?.description ?? ""
  );
  const [imageUploaded, setImageUploaded] = useState(
    projectInfo[0]?.imageUploaded ?? false
  );
  const [coverFile, setCoverFile] = useState(
    projectInfo[0]?.imageUploaded ? { name: `${projectInfo[0]?.id}.png` } : null
  );
  const [filePath, setFilePath] = useState("");

  const postToDatabase = async () => {
    const id = projectInfo[0]?.id;
    if (id === undefined) return;

    let isUploaded = imageUploaded;
    if (imageUploaded && !coverFile) {
      const deleteRes = await fetch("/api/deleteImage", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "DELETE",
        body: JSON.stringify({ key: `projects/${id}.png` }),
      });
      if (deleteRes.ok && imageUploaded) isUploaded = false;
    } else if (coverFile.size) {
      const file = await readFileAsDataURL(coverFile);
      const uploadRes = await fetch("/api/uploadImage", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "PUT",
        body: JSON.stringify({ key: `projects/${id}.png`, file }),
      });
      if (uploadRes.ok && !imageUploaded) isUploaded = true;
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

  const handleFileChange = (e) => {
    if (!e) {
      setCoverFile(null);
      setFilePath("");
    } else {
      const { files, value } = e.target;
      if (files) {
        setCoverFile(files[0]);
        setFilePath(value);
      }
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
              onChange={handleFileChange}
              value={filePath}
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

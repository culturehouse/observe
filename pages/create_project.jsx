import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import LoadingPage from "../components/LoadingPage";
import styles from "../styles/create_event.module.css";
import btnstyles from "../styles/button.module.css";
import readFileAsDataURL from "../helpers/readFileAsDataURL";

export default function Projects({
  setShowCreateProject,
  nonprofitInfo,
  setLoggedIn,
  setCanAccess,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectImage, setProjectImage] = useState(null);
  const [postInProgress, setPostInProgress] = useState(false);

  const router = useRouter();

  const postToDatabase = () => {
    setPostInProgress(true);
    fetch("/api/create_project/create_project", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        npId: nonprofitInfo.non_profit[0].id,
        np_sub: nonprofitInfo.non_profit[0].np_sub,
      }),
    })
      .then((data) => data.json())
      .then(async (r) => {
        setLoggedIn(r.loggedIn);
        setCanAccess(r.canAccess);

        const isCreated = r.loggedIn && r.canAccess && r.newProject?.id;
        if (isCreated && projectImage) {
          const file = await readFileAsDataURL(projectImage);
          const response = await fetch("/api/uploadImage", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            method: "PUT",
            body: JSON.stringify({
              key: `projects/${res.newProject.id}.png`,
              file,
            }),
          });

          if (response.ok) {
            await fetch(`/api/edit_project/${r.newProject.id}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              method: "PUT",
              body: JSON.stringify({
                imageUploaded: true,
              }),
            });
          }
        }

        setPostInProgress(false);
        setShowCreateProject(false);
        if (isCreated) {
          router.push(`/view_project?id=${r.newProject.id}`);
        }
      });
  };

  const handleFileChange = (files) => {
    if (files) {
      setProjectImage(files[0]);
    } else {
      setProjectImage(null);
    }
  };

  if (postInProgress) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.dimmer}>
      <div className={styles.container}>
        <div
          className={styles.closeButton}
          onClick={() => setShowCreateProject(false)}
        >
          <FiX size={20} />
        </div>
        <div className={styles.title}>
          <h3>Create new project</h3>
        </div>
        <h4 className={styles.fieldTitle}>Project name</h4>
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
            <p>
              {projectImage
                ? projectImage.name
                : "Upload cover image (.png only)"}
            </p>
          </label>
          {projectImage && (
            <p className={styles.x} onClick={() => handleFileChange(null)}>
              <FiX />
            </p>
          )}
        </div>
        <div className={styles.createProject}>
          <div className={btnstyles.buttonCreate} onClick={postToDatabase}>
            CREATE PROJECT
          </div>
        </div>
        <Image
          className={styles.popupEllipse}
          src="/PopupEllipse.png"
          width={153}
          height={160}
          alt=""
        />
        <Image
          className={styles.popupPolygon}
          src="/PopupPolygon.png"
          width={104}
          height={240}
          alt=""
        />
      </div>
    </div>
  );
}

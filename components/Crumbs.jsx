import { RiHome2Line } from "react-icons/ri";
import { BsArrowLeftShort } from "react-icons/bs";
import styles from "../styles/crumbs.module.css";

export default function Crumbs({ crumbs, ending }) {
  const cookieList = [];

  if (crumbs.proj) {
    cookieList.push({
      name: crumbs.proj.name,
      path: "/view_project?id=" + crumbs.proj.id,
    });
    if (crumbs.event) {
      cookieList.push({
        name: crumbs.event.name,
        path:
          "/view_event?id=" +
          crumbs.event.id +
          "&projId=" +
          crumbs.proj.id +
          "&projName=" +
          crumbs.proj.name,
      });
    }
  }

  const updatedList = cookieList.map((cookie) => {
    return (
      <span key={cookie.path.split("?")[0]}>
        {" / "}
        <a className={styles.crumbLink} href={cookie.path}>
          {cookie.name}
        </a>
      </span>
    );
  });

  return (
    <div className={styles.crumbs}>
      <a
        key="back-button"
        className={styles.backButton}
        href={
          cookieList.length === 0 ? "/" : cookieList[cookieList.length - 1].path
        }
      >
        <BsArrowLeftShort />
      </a>
      <a key="home" className={styles.crumbLink} href="/">
        {" "}
        <RiHome2Line />{" "}
      </a>
      {updatedList}
      {" / "}
      <span key={ending} className={styles.crumbEnding}>
        {ending}
      </span>
    </div>
  );
}

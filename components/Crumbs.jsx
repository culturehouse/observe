import { RiHome2Line } from "react-icons/ri";
import { BsArrowLeftShort } from "react-icons/bs";
import styles from "../styles/crumbs.module.css";

export default function Crumbs({ crumbs, ending }) {
  let cookieList = [];

  let updatedList = cookieList.map((cookie) => {
    return (
      <>
        &nbsp;/{" "}
        <a className={styles.crumbLink} href={cookie.path}>
          {cookie.name}
        </a>
      </>
    );
  });

  return (
    <>
      <div className={styles.crumbs}>
        <a
          className={styles.backButton}
          href={
            cookieList.length == 0
              ? "/"
              : cookieList[cookieList.length - 1].path
          }
        >
          {" "}
          <BsArrowLeftShort />
        </a>
        <a className={styles.crumbLink} href="/">
          {" "}
          <RiHome2Line />{" "}
        </a>
        {updatedList}
        {" / "}
        <span className={styles.crumbEnding}>{ending}</span>
      </div>
    </>
  );
}

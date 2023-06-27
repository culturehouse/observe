import { RiHome2Line } from "react-icons/ri"
import { BsArrowLeftShort } from "react-icons/bs"
import { useRouter } from "next/router";
import styles from "../styles/crumbs.module.css"

export default function Crumbs({ crumbs, ending }) {
    // console.log(crumbs)
    // let router = useRouter()

    let cookieList = [];

    // let render = (crumbs.np ? true : false)
    let hi = (crumbs.proj ? cookieList.push({ name: crumbs.proj.name, path: "/view_project?id=" + crumbs.proj.id }) : {})
    let yea = (crumbs.event && crumbs.proj ? cookieList.push({ name: crumbs.event.name, path: "/view_event?id=" + crumbs.event.id + "&projId=" + crumbs.proj.id + "&projName=" + crumbs.proj.name }) : {})

    let updatedList = cookieList.map((cookie) => {
        return (
            <>
                &nbsp;/ <a className={styles.crumbLink} href={cookie.path}>{cookie.name}</a>
            </>
        )
    })

    // if (render) {
    return (
        <>
            <div className={styles.crumbs}>
                <a className={styles.backButton} href={cookieList.length == 0 ? "/" : cookieList[cookieList.length - 1].path}> <BsArrowLeftShort /></a>
                <a className={styles.crumbLink} href="/"> <RiHome2Line /> </a>
                {updatedList}
                {" / "}<span className={styles.crumbEnding}>{ending}</span>
            </div>
        </>
    );
    // } else {
    //     return (
    //         <div>HEWWOOOO</div>
    //     )
    // }

};

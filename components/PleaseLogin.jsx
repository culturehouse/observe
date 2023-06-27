import styles from "../styles/please_login.module.css"
import Image from "next/image";
import LoginBackground from "./LoginBackground"
import { BsChevronRight } from "react-icons/bs"


export default function LoadingPage() {

    return (
        <>
            <div className={styles.world}>
                <LoginBackground></LoginBackground>
                <h1 className={styles.text}>You are not logged in</h1>
                <h2 className={styles.loginButton}> <a href="/login" className={styles.link}>Login page<BsChevronRight className={styles.chevron} /></a></h2>
            </div>
        </>
    );

};
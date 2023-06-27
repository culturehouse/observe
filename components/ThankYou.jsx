import styles from "../styles/please_login.module.css"
import Image from "next/image";
import LoginBackground from "./LoginBackground"
import { BsChevronRight } from "react-icons/bs"

export default function ThankYou({eventId}) {

    console.log(eventId);
    return (
        <>
            <div className={styles.world}>
                <LoginBackground></LoginBackground>
                <h1 className={styles.textTY}>Thank you for your contribution!</h1>
                <h2 className={styles.loginButton}><a href={"/volunteerInput/" + eventId} className={styles.link}>Create a new instance<BsChevronRight className={styles.chevron} /></a></h2>
                <h2 className={styles.loginButton}>Go back to the <a href="/volunteer_login" className={styles.link}>volunteer login page<BsChevronRight className={styles.chevron} /></a></h2>
            </div>
        </>
    );

};
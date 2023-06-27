import styles from "../styles/loading.module.css"
import Image from "next/image";
import LoginBackground from "./LoginBackground"


export default function LoadingPage() {

    return (
       <>
       <div className={styles.world}>
        <LoginBackground></LoginBackground>
        <h1 className={styles.loading}>Loading</h1>
       </div>
       </>
    );

};
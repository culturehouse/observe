import styles from "../styles/login.module.css"
import Image from "next/image";

export default function Background1() {

    return (
        <>

            <div className={styles.b1Pentagon}>
                <Image
                    src="/Background1Pentagon.png"
                    width={200}
                    height={400}
                />
            </div>
            <div className={styles.b1PentagonLine}>
                <Image
                    src="/Background1PentagonLiner.png"
                    width={200}
                    height={400}
                />
            </div>
            <div className={styles.b1Circle}>
                <Image
                    src="/Background1Circle.png"
                    width={300}
                    height={600}
                />
            </div>
            <div className={styles.b1CircleLine}>
                <Image
                    src="/Background1CircleLinee.png"
                    width={300}
                    height={600}
                />
            </div>
            
        </>
    );

};
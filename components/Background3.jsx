import styles from "../styles/login.module.css"
import Image from "next/image";

export default function Background3() {

    return (
        <>

            <div className={styles.b3Pentagon}>
                <Image
                    src="/Background3Pentagon.png"
                    width={200}
                    height={400}
                />
            </div>
            <div className={styles.b3PentagonLine}>
                <Image
                    src="/Background3PentagonLine.png"
                    width={200}
                    height={400}
                />
            </div>
            <div className={styles.b3Circle}>
                <Image
                    src="/Background3Circle.png"
                    width={300}
                    height={600}
                />
            </div>
            <div className={styles.b3CircleLine}>
                <Image
                    src="/Background3CircleLine.png"
                    width={300}
                    height={600}
                />
            </div>
            
        </>
    );

};
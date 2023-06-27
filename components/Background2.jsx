import styles from "../styles/login.module.css"
import Image from "next/image";

export default function Background2() {

    return (
        <>

            <div className={styles.b2Triangle}>
                <Image
                    src="/Background2Triangle.png"
                    width={200}
                    height={400}
                />
            </div>
            <div className={styles.b2TriangleLine}>
                <Image
                    src="/Background2TriangleLine.png"
                    width={200}
                    height={400}
                />
            </div>
            <div className={styles.b2Pentagon}>
                <Image
                    src="/Background2Pentagon.png"
                    width={300}
                    height={600}
                />
            </div>
            <div className={styles.b2TriangleLine2}>
                <Image
                    src="/Background2TriangleLine2.png"
                    width={300}
                    height={600}
                />
            </div>
            
        </>
    );

};
import styles from "../styles/login.module.css";
import Image from "next/image";

export default function LoginBackground() {
  return (
    <>
      <div className={styles.quadContainer}>
        <Image src="/Quad.png" width={300} height={600} />
      </div>
      <div className={styles.quadLineContainer}>
        <Image src="/QuadLine.png" width={300} height={600} />
      </div>
      <div className={styles.circleContainer}>
        <Image src="/Circle.png" width={300} height={600} />
      </div>
      <div className={styles.pentagonContainer}>
        <Image src="/Pentagon.png" width={300} height={600} />
      </div>
    </>
  );
}

import { useRouter } from 'next/router'
import styles from "../../styles/create_instance.module.css";
import ObserveLogo from "../../components/ObserveLogo";
import VolunteerCanvas from "../../components/VolunteerCanvas";

export default function Mapping() {
  const router = useRouter();

    return (
      <div className={styles.world}>
        <div className={styles.border}>
          <ObserveLogo></ObserveLogo>
          <div>
      
          </div>
          <div>
            <p className={styles.create}>Create new instance</p>
          </div>
          <VolunteerCanvas eventId={router.query.eventId}/>
        </div>
      </div>
    );

}

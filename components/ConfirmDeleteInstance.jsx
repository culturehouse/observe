import { FiX } from "react-icons/fi";
import styles from "../styles/create_event.module.css";
import btnstyles from "../styles/button.module.css";

export default function ConfirmDeleteInstance({
  setIsOpen = () => {},
  handleConfirm = () => {},
}) {
  return (
    <div className={styles.dimmer}>
      <div className={styles.container}>
        <div className={styles.closeButton} onClick={() => setIsOpen(false)}>
          <FiX size={20} />
        </div>
        <div className={styles.title}>
          <h3>Delete instance</h3>
        </div>
        <h4 className={styles.fieldTitle}>Are you sure to delete instance?</h4>
        <div className={styles.createProject}>
          <div className={btnstyles.buttonCreate} onClick={handleConfirm}>
            Confirm
          </div>
        </div>
      </div>
    </div>
  );
}

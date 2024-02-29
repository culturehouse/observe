import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import styles from "../styles/create_button.module.css";
import Image from "next/image";
import plus from "../public/cb_plus.svg";
import Link from "next/link";

export default function CreateButton({ id, param }) {
  const { eventName, projId, projName } = JSON.parse(param);
  return (
    <div className={styles.container}>
      <Dropdown>
        <DropdownTrigger>
          <Button css={{ backgroundColor: "$myColor" }}>
            <Image src={plus} width={24} height={24} className={styles.plus} />
            CREATE
          </Button>
        </DropdownTrigger>
        <DropdownMenu css={{ width: "$cbwidth" }} aria-label="Static Actions">
          <DropdownItem key="heatmap" className={styles.dd_item}>
            <Link
              href={`/create_heatmap?id=${id}&eventId=${id}&eventName=${eventName}&projId=${projId}&projName=${projName}`}
            >
              New heatmap
            </Link>
          </DropdownItem>
          <DropdownItem key="instance" className={styles.dd_item}>
            <Link
              href={`/ShapeMapping?id=${id}&eventId=${id}&eventName=${eventName}&projId=${projId}&projName=${projName}`}
            >
              New instance
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

import { Dropdown, createTheme, styled } from "@nextui-org/react";
import styles from "../styles/create_button.module.css"
import Image from "next/image";
import plus from "../public/cb_plus.svg"
import Link from 'next/link'


export default function DropdownButton({id, param}) {
    console.log(param)
    param = JSON.parse(param)
    return (
        <div className={styles.container}>
            <Dropdown>
                <Dropdown.Button css={{ backgroundColor: '$myColor' }}>
                    <Image 
                        src={plus}
                        width={24}
                        height={24}
                        className={styles.plus}
                    />
                    CREATE
                </Dropdown.Button>
                <Dropdown.Menu css={{ width: '$cbwidth' }} aria-label="Static Actions">
                    {/* The login is a place holder, the link will be to the heatmap creation page */}
                    <Dropdown.Item key="heatmap" className={styles.dd_item}> <Link href={`/create_heatmap?id=${id}&eventId=${id}&eventName=${param.eventName}&projId=${param.projId}&projName=${param.projName}`}>New heatmap</Link></Dropdown.Item>
                    <Dropdown.Item key="instance" className={styles.dd_item}><Link href={`/ShapeMapping?id=${id}&eventId=${id}&eventName=${param.eventName}&projId=${param.projId}&projName=${param.projName}`}>New instance</Link></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}
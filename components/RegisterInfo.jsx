import React, { useState } from "react";
import styles from "../styles/register_info.module.css"

export default function RegisterInfo({setDisplay}) {
    const u_list = ["Username should be between 1 and 30 characters",
                    "Cannot contain characters other than alphabet characters, numbers, and certain special characters (_@#.^`'-*)"];
    const p_list = ["Should have at least one lower case alphabet character", 
                    "Should have at least one upper case alphabet character",
                    "Should have at least one number", 
                    "Should have at least one special character (!@#$%^&*)",
                    "Should have more than 8 characters"];

    const u_updated = u_list.map((item) => {
        return <li>{item}</li>;
    })

    const p_updated = p_list.map((item) => {
        return <li>{item}</li>;
    })
    return (
        <div className={styles.container}>
            <div className={styles.closeButton} onClick={() => { setDisplay(false) }}>X</div>
            <br /><br /><br /> 
            <div className={styles.title}>
                <h5>Sign up requirements</h5>
                <h6>Username</h6>
                <ul>{u_updated}</ul>
                <h6>Password</h6>
                <ul className={styles.bottom}>{p_updated}</ul>

                {/* <h6> Username should be between 1 and 30 characters. </h6>
                <h6> Cannot contain characters other than alphabet characters, numbers, _ , @ , # , . , ^ , ` , ' , - and * </h6> */}
            </div>
        </div>
    );
};
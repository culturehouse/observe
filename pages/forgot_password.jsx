import Head from "next/head";
import React, { useState } from "react";
import { auth } from "../services/auth0.service"
import LoginBackground from "../components/LoginBackground";
import { BiMapPin } from  "react-icons/bi"
import styles from "../styles/login.module.css"

export default function Login() {
    const [user, setUser] = useState({ email: "", valid: false});
    const email_regex = new RegExp('^[A-Za-z0-9_!#\$%&\*+/=?\`{}~\^\.-]+@[A-Za-z0-9\.-]+[\.][A-Za-z0-9]+$');

    const onChangeHandler = (e) => {
        setUser({
            valid: email_regex.test(e.target.value),
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = (event) => {
        console.log(user)
        auth.changePassword({
            connection: "Username-Password-Authentication",
            email: user.email
        }, function (err, resp) {
            if (err) {
                console.log(err)
            } else {
                console.log(resp);
                alert("Check your inbox for our email!")
            }
        });
       
    };
    return (
        <>
            <Head>
                <title>
                    Forgot password | Observe
                </title>
            </Head>
            <div className={styles.world}>
                <div className={styles.loginContainer}>
                    <div className={styles.loginHeader}>
                        {/* <div className={styles.logoContainer}>
                        <Image
                            src="/PublicFlowLogo.png"
                            width={300}
                            height={600}
                            layout="responsive"
                            objectFit="contain"
                        />
                    </div> */}
                        <h3><BiMapPin /> Observe</h3>
                        {/* <ObserveLogo></ObserveLogo> */}
                        <h5>Change password</h5>
                        <h6>Please enter your email address and we will send you a link to update your password</h6>
                    </div>
                    <div className={styles.form}>
                        <form>
                            {user.email == "" || user.valid ?
                                <input type="email"
                                    className={styles.validInput}
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="Email"
                                    value={user.email}
                                    onChange={onChangeHandler}
                                />
                                :
                                <input type="email"
                                    className={styles.invalidInput}
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="Email"
                                    value={user.email}
                                    onChange={onChangeHandler}
                                />
                            }

                            {(user.valid) ?
                                <div className={styles.submitDiv}>
                                    <button type="button" id="btn-login" className={styles.logButton} onClick={onSubmit} data-turbo="false">SEND EMAIL</button>
                                </div>
                                :
                                <div className={styles.submitDiv}>
                                    <button type="button" id="btn-login" className={styles.logButtoni} onClick={onSubmit} data-turbo="false" disabled>SEND EMAIL</button>
                                </div>
                            }

                        </form>
                    </div>
                    <div className={styles.userpassword}></div>
                    <LoginBackground />
                    <div className={styles.ntrp}> Not the right page?&nbsp; Go back to&nbsp;<a href="/login">Login</a>&nbsp;or&nbsp;<a href="/register">Sign Up</a>&nbsp;instead</div>
                </div>
            </div>
        </>
    );
}


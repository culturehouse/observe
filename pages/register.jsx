import Head from "next/head";
import clientPromise from "../lib/mongodb";
import React, { useState, useEffect } from "react";
import { auth } from "../services/auth0.service"
import LoginBackground from "../components/LoginBackground";
import { AiFillInfoCircle } from 'react-icons/ai';
import RegisterInfo from "../components/RegisterInfo";
import { BiMapPin } from "react-icons/bi"

import styles from "../styles/login.module.css"
import { AUTH0_CLIENT_ID, AUTH0_LOGIN_REDIRECT_URI, AUTH0_LOGIN_RESPONSE_TYPE, AUTH0_REALM } from "../services/config";

export async function getServerSideProps(context) {
    try {
        await clientPromise;
        return {
            props: { isConnected: true },
        };
    } catch (e) {
        console.error(e);
        return {
            props: { isConnected: false },
        };
    }
}

export default function Register({ isConnected }) {
    const [user, setUser] = useState({name: "", email: "", password: "" , username: ""});
    const [inputVerified, setinputVerified] = useState({name: false, username: false, email:false, password: false})
    const [infoDisplay, setinfoDisplay] = useState(false);
    const onChangeHandler = (e) => {

        const username_regex = new RegExp('^[A-Za-z0-9_@#.\^\`\'\-]*$');
        const email_regex = new RegExp('^[A-Za-z0-9_!#\$%&\*+/=?\`{}~\^\.-]+@[A-Za-z0-9\.-]+[\.][A-Za-z0-9]+$');
        const password_regex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#\$\%\^\&\*])(?=.{8,})')

        if (e.target.name == "username") {
            console.log(e.target.value)
            console.log(username_regex.test(e.target.value))
            setinputVerified({
                ...inputVerified,
                [e.target.name]: username_regex.test(e.target.value) && (e.target.value != "")
            })
        } else if (e.target.name == "email") {
            console.log(e.target.value)
            console.log(email_regex.test(e.target.value))
            setinputVerified({
                ...inputVerified,
                [e.target.name]: email_regex.test(e.target.value) && (e.target.value != "")
            })
        } else if (e.target.name == "password") {
            console.log(e.target.value)
            console.log(password_regex.test(e.target.value))
            setinputVerified({
                ...inputVerified,
                [e.target.name]: password_regex.test(e.target.value) && (e.target.value != "")
            })
        } else if (e.target.name == "name") {
            setinputVerified({
                ...inputVerified,
                [e.target.name]: (e.target.value != "")
            })
        }


        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === 'Enter') {
                document.getElementById('btn-login').click();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const onSubmit = (event) => {
        event.stopPropagation()
        console.log(user)
        auth.signup({
            nickname: user.name,
            username: user.username,
            email: user.email, 
            password: user.password,
            connection: AUTH0_REALM,
        }, function(error, result) {
            if (error) {
                console.log("Registration went wrong");
                alert("Registration Unsuccessful");
                console.log(error)
                return;
            }
            console.log("Registration is succesful");
            console.log(result);
            let sub = "auth0|" + result.Id

            const res2 = fetch("/api/register/createNonProfit", {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                method: 'POST',
                body: JSON.stringify({
                    name: user.name,
                    username: user.username,
                    projects: [],
                    np_sub: sub,
                }),
            }).then((r) => 
            {
                auth.login({
                    username: user.username,
                    password: user.password,
                    realm: AUTH0_REALM,
                    redirectUri: AUTH0_LOGIN_REDIRECT_URI,
                    responseType: AUTH0_LOGIN_RESPONSE_TYPE,
                }, function (error, result) {
                    if (error) {
                        console.log("Oops! Login Failed")
                        console.log(error)
                        return;
                    }

                    console.log("Login Succesfull")
                    console.log(result)
                });
            }
            );

        }
        )
    };
    return (
        <>
            <Head>
                <title>
                    Registration | Observe
                </title>
            </Head>
            <div className={styles.world}>
                {infoDisplay ? <RegisterInfo setDisplay={setinfoDisplay}></RegisterInfo> : <></>}
                <div className={styles.loginContainer}>
                    <div className={styles.loginHeader}>
                        <h3><BiMapPin /> Observe</h3>
                        <div className={styles.titleCon}><AiFillInfoCircle onClick={() => setinfoDisplay(true)} /><h5 className={styles.marginh5}>&nbsp;Sign up</h5></div>
                       
                       
                        {/* <h6>By signing up, I agree to PublicFlow’s Privacy Policy and Terms of Service</h6> */}
                    </div>
                    <div className={styles.form}>
                        <form>
                            {
                                (inputVerified.name || user.name == "") ?
                                    <input type="text"
                                        className={styles.validInput}
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="Organization name"
                                        value={user.name}
                                        onChange={onChangeHandler}
                                    />
                                :
                                    <input type="text"
                                        className={styles.invalidInput}
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="Organization name"
                                        value={user.name}
                                        onChange={onChangeHandler}
                                    />
                            }
                           
                            {
                                (inputVerified.username || user.username == "") ?
                                    <input type="text"
                                        className={styles.validInput}
                                        id="username"
                                        name="username"
                                        required
                                        placeholder="Organization username"
                                        value={user.username}
                                        onChange={onChangeHandler}
                                    />
                                    :
                                    <input type="text" 
                                        className={styles.invalidInput}
                                        id="username"
                                        name="username"
                                        required
                                        placeholder="Organization username"
                                        value={user.username}
                                        onChange={onChangeHandler}
                                    />
                            }
                            {
                                (inputVerified.email || user.email == "") ?
                                    <input type="email"
                                        className={styles.validInput}
                                        id="email"
                                        name="email"
                                        required
                                        placeholder="Organization email"
                                        value={user.email}
                                        onChange={onChangeHandler}
                                    />
                                    : 
                                    <input type="email"
                                        className={styles.invalidInput}
                                        id="email"
                                        name="email"
                                        required
                                        placeholder="Organization email"
                                        value={user.email}
                                        onChange={onChangeHandler}
                                    />

                            }
                            {
                                (inputVerified.password || user.password == "") ?
                                    <input type="password"
                                        className={styles.validInput}
                                        id="password"
                                        name="password"
                                        required
                                        placeholder="Password"
                                        value={user.password}
                                        onChange={onChangeHandler}
                                    />
                                    :
                                    <input type="password"
                                        className={styles.invalidInput}
                                        id="password"
                                        name="password"
                                        required
                                        placeholder="Password"
                                        value={user.password}
                                        onChange={onChangeHandler}
                                    />
                            }
                            
                            <div className={styles.submitDiv}>
                                { (inputVerified.username && inputVerified.email && inputVerified.password && inputVerified.name) ?
                                    <button type="button" id="btn-login" className={styles.logButton} onClick={onSubmit} data-turbo="false">SIGN UP</button>
                                    :
                                    <button type="button" id="btn-login" className={styles.logButtoni} data-turbo="false" disabled>SIGN UP</button>
                                }
                               
                            </div>
                            <div className={styles.ntrp}> Not the right page?&nbsp; <a href="/login">Log in instead</a></div>
                        </form>
                    </div>
                    <div className={styles.userpassword}></div>
                    <LoginBackground/>
                </div>
            </div>
        </>
    );
}

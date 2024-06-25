import Head from "next/head";
import React, { useState, useEffect } from "react";
import { auth } from "../services/auth0.service";
import LoginBackground from "../components/LoginBackground";
import { BiMapPin } from "react-icons/bi";
import styles from "../styles/login.module.css";

export async function getStaticProps() {
  return {
    props: {
      realm: process.env.AUTH0_REALM,
      redirectUri: process.env.AUTH0_LOGIN_REDIRECT_URI,
      responseType: process.env.AUTH0_LOGIN_RESPONSE_TYPE,
    },
  };
}

export default function Login({ realm, redirectUri, responseType }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const onChangeHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (event) => {
    auth.login(
      {
        username: user.email,
        password: user.password,
        realm,
        redirectUri,
        responseType,
      },
      function (error, result) {
        if (error) {
          alert(
            "Login failed, please make sure your email/username and password are correct"
          );
          console.log(error);
          return;
        }
        console.log(result);
      }
    );
  };

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        document.getElementById("btn-login").click();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Log in | Observe</title>
      </Head>
      <div className={styles.world}>
        <LoginBackground />
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
            <h3>
              <BiMapPin /> Observe
            </h3>
            {/* <ObserveLogo></ObserveLogo> */}
            <h5>Log in</h5>
            <h6>Please enter your log in and password</h6>
          </div>
          <div className={styles.form}>
            <form>
              <input
                type="email"
                className={styles.validInput}
                id="email"
                name="email"
                required
                placeholder="Username or Email"
                value={user.email}
                onChange={onChangeHandler}
              />
              <input
                type="password"
                className={styles.validInput}
                id="password"
                name="password"
                required
                placeholder="Password"
                value={user.password}
                onChange={onChangeHandler}
              />
              {/* <div className={styles.fp}><a href="/forgot_password">Forgot password?</a></div> */}
              <a href="/forgot_password" className={styles.fp}>
                Forgot password?
              </a>
              {/* <div className={styles.forgotPassword}>Forgot Password?</div> */}
              {user.email != "" && user.password != "" ? (
                <div className={styles.submitDiv}>
                  <button
                    type="button"
                    id="btn-login"
                    className={styles.logButton}
                    onClick={onSubmit}
                    data-turbo="false"
                  >
                    LOGIN
                  </button>
                </div>
              ) : (
                <div className={styles.submitDiv}>
                  <button
                    type="button"
                    id="btn-login"
                    className={styles.logButtoni}
                    onClick={onSubmit}
                    data-turbo="false"
                    disabled
                  >
                    LOGIN
                  </button>
                </div>
              )}
            </form>
          </div>
          <div className={styles.userpassword}></div>
          {/* <div className={styles.ntrp}> Not the right page?&nbsp; <a href="/volunteer_login">Log in as a volunteer</a>&nbsp;or&nbsp;<a href="/register">Sign Up</a>&nbsp;instead</div> */}
          <p className={styles.ntrp}>
            Not the right page?&nbsp;
            <a href="/volunteer_login" className={styles.link}>
              Log in as a Observer
            </a>
            &nbsp;or&nbsp;
            <a href="/register" className={styles.link}>
              sign up
            </a>
            &nbsp;instead
          </p>
        </div>
      </div>
    </>
  );
}

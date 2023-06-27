import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { useState, useEffect } from "react";
import ReactCodeInput from "react-code-input";
import LoginBackground from "../components/LoginBackground";

import styles from "../styles/volunteer.module.css";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

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

export default function Home({ isConnected }) {
  const [name, setName] = useState("");
  const [validCode, setValidCode] = useState(false);
  const [correctCode, setCorrectCode] = useState();

  const router = useRouter();
  const navigate = () => {
    const res = fetch(`/api/volunteerLogin/${name}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
    })
      .then((data) => data.json())
      .then((r) => {
        if (r.valid) {
          router.push(`./volunteerInput/${r.eventId}`);
        } else {
          setCorrectCode(false);
          alert("Please make sure you enter the correct event id")
        }
      });
    // router.push("./second");
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

  const handleCodeChange = (code) => {
    setName(code);
    if (code.length == 6) {
      setValidCode(true);
    } else {
      setValidCode(false);
    }
  };


  return (
    <>
      <Head>
        <title>
          Volunteer login | Observe
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
            <h3>Observe</h3>
            <h5>Volunteer log in</h5>
            <h6>Please enter your event code</h6>
          </div>
          <div className={styles.form}>
            <form>
              <div className={styles.codeForm}>
                <ReactCodeInput fields={6} onChange={handleCodeChange} />
              </div>
              {/* <div className={styles.forgotPassword}>Forgot Password?</div> */}
              {(validCode) ?
                <div className={styles.submitDiv}>
                  <button type="button" id="btn-login" className={styles.logButton} onClick={()=> navigate()} data-turbo="false">LOGIN</button>
                </div>
                :
                <div className={styles.submitDiv}>
                  <button type="button" id="btn-login" className={styles.logButtoni} onClick={() => navigate()} data-turbo="false" disabled>LOGIN</button>
                </div>
              }

            </form>
          </div>
          <div className={styles.userpassword}></div>
          <LoginBackground />
          <div className={styles.ntrp}> Not the right page?&nbsp; <a href="/login" className={styles.link}>Log in as an admin</a>&nbsp;or&nbsp;<a href="/register" className={styles.link}>sign up</a>&nbsp;instead</div>
        </div>
      </div>
    </>
  )

  // return (
  //   <div>
  //     {" "}
  //     <LoginBackground></LoginBackground>
  //     <div className={styles.loginContainer}>
  //       <p className={styles.publicFlow}>Observe</p>
  //       <p className={styles.enter}>Enter</p>
  //       <p className={styles.enter2}>Please enter your event code below</p>
  //       <p className={styles.eg}>(e.g. XX1234)</p>
  //       <div className={styles.form}>
  //         <ReactCodeInput fields={6} onChange={handleCodeChange} />
  //       </div>

  //       {validCode ? (
  //         <button onClick={navigate} className={styles.button}>
  //           <p className={styles.enterText}>{name}</p>
  //         </button>
  //       ) : (
  //         <button onClick={navigate} className={styles.button} disabled>
  //           <p className={styles.enterText}> ENTER</p>
  //         </button>
  //       )}
  //       <div className={styles.not}>Not the right page?</div>
  //       <div className={styles.not2}>
  //         {" "}
  //         <a href="/login">Login as an admin instead</a>
  //       </div>
  //     </div>
  //   </div>
  // );
}

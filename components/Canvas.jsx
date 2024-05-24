import React, { useRef, useEffect, useState } from "react";
import { BiUndo } from "react-icons/bi";
import Dropdown from "./Dropdown";
import { useRouter } from "next/router";
import styles from "../styles/create_instance.module.css";

export const WIDTH = 558;
export const HEIGHT = 558;

const Canvas1 = (props) => {
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    ctx.fillStyle = "#DD3E3E";
    ctx.fillRect(20, 10, 60, 60);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //Our draw come here
    draw(context);
  }, [draw]);

  return <canvas ref={canvasRef} {...props} width={100} height={80} />;
};

const Canvas2 = (props) => {
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    ctx.fillStyle = "#F8B319";
    ctx.beginPath();
    ctx.moveTo(50, 10);
    ctx.lineTo(85, 70);
    ctx.lineTo(15, 70);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //Our draw come here
    draw(context);
  }, [draw]);

  return <canvas ref={canvasRef} {...props} width={100} height={80} />;
};

const Canvas3 = (props) => {
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    const circle = new Path2D();
    ctx.fillStyle = "#8DBE40";
    circle.arc(50, 40, 35, 0, 2 * Math.PI);
    ctx.fill(circle);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //Our draw come here
    draw(context);
  }, [draw]);

  return <canvas ref={canvasRef} {...props} width={100} height={80} />;
};

const CanvasMain = ({ position, setsnsDataArray, snsDataArray, setSize }) => {
  const canvasRef = useRef(null);

  const drawCur = () => {
    console.log("Drawing array of length", snsDataArray.length);
    snsDataArray.forEach((element) => {
      const { position, xcor, ycor } = element;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (position == "other") {
        const circle = new Path2D();
        context.fillStyle = "#8DBE40";
        circle.arc(xcor, ycor, 9, 0, 2 * Math.PI);
        context.fill(circle);
      } else if (position == "sitting") {
        context.fillStyle = "#DD3E3E";
        context.fillRect(xcor - 8, ycor - 8, 16, 16);
      } else {
        context.fillStyle = "#F8B319";
        context.beginPath();
        context.moveTo(xcor, ycor - 8);
        context.lineTo(xcor - 10, ycor + 10);
        context.lineTo(xcor + 10, ycor + 10);
        context.fill();
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
  }, []);

  useEffect(drawCur, [snsDataArray]);

  const draw = async ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setsnsDataArray([
      ...snsDataArray,
      { position, xcor: offsetX, ycor: offsetY },
    ]);
    setSize(snsDataArray.length + 1);
  };

  const onBackPress = (event) => {
    if (snsDataArray.length != 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      setSize(snsDataArray.length - 1);
      setsnsDataArray(snsDataArray.slice(0, -1));
    }
  };

  return (
    <>
      <div>
        <span className={styles.undoSpan} onClick={onBackPress}>
          <BiUndo />
        </span>
      </div>
      <div className={styles.canvasmain}>
        <p className={styles.sketch}>
          Select mode and click on map to mark location
        </p>
        <canvas ref={canvasRef} onClick={draw} tabIndex="0" />
      </div>
    </>
  );
};

export default function Canvas({ setLoggedIn, setCanAccess }) {
  const [position, setposition] = useState("sitting");
  const [snsDataArray, setsnsDataArray] = useState([]);
  const [volunteerName, setVolunteerName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState("");
  const [notes, setNotes] = useState("");
  const [temperature, setTemperature] = useState("");
  const [clicked, setClicked] = useState({
    sitting: true,
    standing: false,
    other: false,
  });
  const [sending, setSending] = useState(false);
  console.log(date);
  const [size, setSize] = useState(0);
  const fahrenheitMargin = temperature.length * 8 + 22 + "px";

  const router = useRouter();
  const { eventId } = router.query;

  const temperature_regex = new RegExp("^[0-9]*$");

  const weatherOptions = [
    { value: "Sunny", label: "Sunny" },
    { value: "Partly cloudy", label: "Partly cloudy" },
    { value: "Cloudy", label: "Cloudy" },
    { value: "Windy", label: "Windy" },
    { value: "Drizzle", label: "Drizzle" },
    { value: "Raining", label: "Raining" },
    { value: "Snowing", label: "Snowing" },
  ];

  const toSitting = () => {
    setClicked({ sitting: true, standing: false, other: false });
    setposition("sitting");
  };
  const toStanding = () => {
    setClicked({ sitting: false, standing: true, other: false });
    setposition("standing");
  };
  const toOther = () => {
    setClicked({ sitting: false, standing: false, other: true });
    setposition("other");
  };

  const onCanvasSubmit = () => {
    // TODO: Empty fields are allowed, something on the handle on server side
    setSending(true);
    if (
      volunteerName == "" ||
      date == "" ||
      time == "" ||
      weather == "" ||
      temperature == ""
    ) {
      alert(
        "Please make sure you fill out all necessary information before submission"
      );
      setSending(false);
      return;
    }

    if (!temperature_regex.test(temperature)) {
      alert(
        "Instance Creation Failed. Please make sure you are entering a number value for the temperature"
      );
      setSending(false);
      return;
    }

    const response = fetch(`/api/create_instance/${router.query.eventId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
    })
      .then((data) => data.json())
      .then((r) => {
        if (!r.validEvent) {
          if (!r.loggedIn) {
            alert(r.message);
            setLoggedIn(false);
          } else if (!r.access) {
            setCanAccess(false);
          }
          setSending(false);
          return;
        }
        const res2 = fetch("/api/create_instance/new_instance", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
          body: JSON.stringify({
            data: snsDataArray,
            dateTime: new Date(date),
            notes: notes,
            time: time,
            volunteerName: volunteerName,
            weather: weather,
            temperature: parseInt(temperature),
            eventId: r.event.id,
            np_sub: r.event.np_sub,
          }),
        })
          .then((data) => data.json())
          .then((r) => {
            if (r.created) {
              alert("New instance has been created.\n");
              router.push(
                `/instances?id=${router.query.eventId}&eventId=${router.query.eventId}&eventName=${router.query.eventName}&projId=${router.query.projId}&projName=${router.query.projName}`
              );
            } else {
              alert("New instance creation has failed, please try again.\n");
              setSending(false);
            }
          });
        // window.location.reload()
      });
  };

  return (
    <div className={styles.outer}>
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <div className={styles.sidebar}>
            <button
              className={
                clicked.sitting ? styles.drawbuttonClicked : styles.drawbutton
              }
              onClick={toSitting}
            >
              <Canvas1 />
              <p className={styles.canvas}> Sitting</p>
            </button>
            <div className={styles.spacing_drawbutton}></div>
            <button
              className={
                clicked.standing ? styles.drawbuttonClicked : styles.drawbutton
              }
              onClick={toStanding}
            >
              <Canvas2 />
              <p className={styles.canvas}> Standing</p>
            </button>
            <div className={styles.spacing_drawbutton}></div>
            <button
              className={
                clicked.other ? styles.drawbuttonClicked : styles.drawbutton
              }
              onClick={toOther}
            >
              <Canvas3 />
              <p className={styles.canvas}> Other</p>
            </button>
          </div>
          <img
            className={styles.picture}
            src={`https://observe-images.s3.amazonaws.com/events/${eventId}.png`}
            height={559}
            width={559}
          />
          <CanvasMain
            position={position}
            setsnsDataArray={setsnsDataArray}
            snsDataArray={snsDataArray}
            setSize={setSize}
            size={size}
          />
        </div>
        <div className={styles.separator}></div>
        <div className={styles.inputFields}>
          <p className={styles.volunteer}>Volunteer name</p>
          <input
            value={volunteerName}
            onChange={(e) => setVolunteerName(e.target.value)}
            className={styles.volbox}
            type="text"
          ></input>
          <div className={styles.inputFieldsSpacing}></div>
          <div className={styles.dateTime}>
            <div className={styles.date}>
              <p className={styles.volunteer}>Date</p>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.dateBox}
                type="date"
              ></input>
            </div>
            <div className={styles.dateSpacing}></div>
            <div className={styles.date}>
              <p className={styles.volunteer}>Time</p>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={styles.dateBox}
                type="time"
              ></input>
            </div>
          </div>
          <div className={styles.inputFieldsSpacing}></div>
          <div className={styles.dateTime}>
            <div className={styles.date}>
              <p className={styles.volunteer}>Temperature</p>
              {temperature_regex.test(temperature) ? (
                <input
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className={styles.dateBox}
                  type="text"
                ></input>
              ) : (
                <input
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className={styles.invaliddateBox}
                  type="text"
                ></input>
              )}
              {temperature_regex.test(temperature) || temperature == "" ? (
                <p
                  className={styles.fahrenheit}
                  style={{ color: "black", marginLeft: fahrenheitMargin }}
                >
                  ˚F
                </p>
              ) : (
                <p
                  className={styles.fahrenheit}
                  style={{ color: "#db0000", marginLeft: fahrenheitMargin }}
                >
                  ˚F
                </p>
              )}
            </div>
            <div className={styles.dateSpacing}></div>
            <div className={styles.date}>
              <p className={styles.volunteer}>Weather</p>
              <Dropdown
                placeHolder="Select..."
                options={weatherOptions}
                set={setWeather}
              ></Dropdown>
              {/* <input
							value={weather}
							onChange={(e) => setWeather(e.target.value)}
							className={styles.dateBox}
							type="text"
							placeholder="Sunny"
						></input> */}
            </div>
          </div>
          <div className={styles.inputFieldsSpacing}></div>
          <p className={styles.volunteer}>Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={styles.noteBox}
            rows={5}
            cols={50}
          ></textarea>
          {sending ? (
            <button
              onClick={onCanvasSubmit}
              className={styles.sendButton}
              disabled
            >
              <p className={styles.InstButton}>CREATE INSTANCE</p>
            </button>
          ) : (
            <button onClick={onCanvasSubmit} className={styles.sendButton}>
              <p className={styles.InstButton}>CREATE INSTANCE</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

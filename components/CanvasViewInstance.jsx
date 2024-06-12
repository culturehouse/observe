import React from "react";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import DensityGraphViewInstance from "./DensityGraphViewInstance";
import DensityGraph from "./DensityGraph";
import styles from "../styles/create_instance.module.css";

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

const CanvasMain = ({
  position,
  setsnsDataArray,
  snsDataArray,
  setSize,
  size,
}) => {
  const canvasRef = useRef(null);

  const drawCur = () => {
    console.log("Drawing array of length", snsDataArray.length);
    snsDataArray.forEach((element) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (element.position == "other") {
        const circle = new Path2D();
        context.fillStyle = "#8DBE40";
        circle.arc(element.xcor, element.ycor, 25, 0, 2 * Math.PI);
        context.fill(circle);
      } else if (element.position == "sitting") {
        context.fillStyle = "#DD3E3E";
        context.fillRect(element.xcor - 25, element.ycor - 25, 50, 50);
      } else {
        context.fillStyle = "#F8B319";
        context.beginPath();
        context.moveTo(element.xcor, element.ycor - 40);
        context.lineTo(element.xcor - 25, element.ycor + 20);
        context.lineTo(element.xcor + 25, element.ycor + 20);
        context.fill();
      }
    });
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 558;
    canvas.height = 558;
    drawCur();
  }, []);

  useEffect(() => drawCur(), [snsDataArray]);

  const draw = async ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (position == "other") {
      const circle = new Path2D();
      context.fillStyle = "#8DBE40";
      circle.arc(offsetX, offsetY, 25, 0, 2 * Math.PI);
      context.fill(circle);
    } else if (position == "sitting") {
      context.fillStyle = "#DD3E3E";
      context.fillRect(offsetX - 25, offsetY - 25, 50, 50);
    } else {
      context.fillStyle = "#F8B319";
      context.beginPath();
      context.moveTo(offsetX, offsetY - 40);
      context.lineTo(offsetX - 25, offsetY + 20);
      context.lineTo(offsetX + 25, offsetY + 20);
      context.fill();
    }
    setsnsDataArray([
      ...snsDataArray,
      { position: position, xcor: offsetX, ycor: offsetY },
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
      {/* <div><span className={styles.undoSpan} onClick={onBackPress}><BiUndo /></span></div> */}
      <div className={styles.canvasmain}>
        {/* <p className={styles.sketch}>Select mode and click on map to mark location</p> */}
        <canvas ref={canvasRef} onClick={draw} tabIndex="0" />
      </div>
    </>
  );
};

export default function Canvas({ setLoggedIn, instance }) {
  console.log(instance[0]);
  const [position, setposition] = useState("sitting");
  const [snsDataArray, setsnsDataArray] = useState([]);

  // const [volunteerName, setVolunteerName] = useState(instance[0].volunteerName);
  // const [date, setDate] = useState(instance[0].dateTime);
  // const [time, setTime] = useState(instance[0].time);
  // const [weather, setWeather] = useState(instance[0].weather);
  // const [notes, setNotes] = useState(instance[0].notes);
  // const [temperature, setTemperature] = useState(instance[0].temperature);

  const [volunteerName, setVolunteerName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState("Select...");
  const [notes, setNotes] = useState("");
  const [temperature, setTemperature] = useState("");

  // if (instance) {
  // 	setVolunteerName(instance[0].volunteerName);
  // }

  useEffect(() => {
    setVolunteerName(instance[0].volunteerName);
    // setDate(instance[0].dateTime.slice(0, 10));
    setTime(instance[0].time);
    setWeather(instance[0].weather);
    setNotes(instance[0].notes);
    setTemperature(instance[0].temperature);
  }, [instance]);

  useEffect(() => {
    if (instance[0].dateTime) setDate(instance[0].dateTime.slice(0, 10));
  }, [instance[0].dateTime]);

  const [clicked, setClicked] = useState({
    sitting: true,
    standing: false,
    other: false,
  });
  console.log(date);
  const [size, setSize] = useState(0);

  const router = useRouter();
  const { eventId } = router.query;

  const temperature_regex = new RegExp("^[0-9]*$");

  const weatherOptions = [
    { value: "Sunny", label: "Sunny" },
    { value: "Partly Cloudy", label: "Partly Cloudy" },
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

  return (
    <div className={styles.outer}>
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <img
            className={styles.pictureViewInstance}
            src={`https://observe-images.s3.amazonaws.com/events/${eventId}.png`}
            height={559}
            width={559}
          />
          <div className={styles.densityGraph}>
            <DensityGraphViewInstance data={instance[0].data} />
            {/* <DensityGraph data={instance[0].data}/> */}
          </div>
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
            className={styles.volbox}
            type="text"
            readOnly
            disabled
          ></input>
          <div className={styles.inputFieldsSpacing}></div>
          <div className={styles.dateTime}>
            <div className={styles.date}>
              <p className={styles.volunteer}>Date</p>
              <input
                value={date}
                className={styles.dateBox}
                type="date"
                readOnly
                disabled
              ></input>
            </div>
            <div className={styles.dateSpacing}></div>
            <div className={styles.date}>
              <p className={styles.volunteer}>Time</p>
              <input
                value={time}
                className={styles.dateBox}
                type="time"
                readOnly
                disabled
              ></input>
            </div>
          </div>
          <div className={styles.inputFieldsSpacing}></div>
          <div className={styles.dateTime}>
            <div className={styles.date}>
              <p className={styles.volunteer}>Temperature</p>
              <input
                value={temperature + "˚F"}
                className={styles.dateBox}
                type="text"
                readOnly
                disabled
              ></input>
            </div>
            <div className={styles.dateSpacing}></div>
            <div className={styles.date}>
              <p className={styles.volunteer}>Weather</p>
              {/* <Dropdown placeHolder={weather} options={weatherOptions} set={setWeather}></Dropdown> */}
              <input
                value={weather}
                className={styles.dateBox}
                type="text"
                readOnly
                disabled
              ></input>
            </div>
          </div>
          <div className={styles.inputFieldsSpacing}></div>
          <p className={styles.volunteer}>Notes</p>
          <textarea
            value={notes}
            className={styles.noteBox}
            rows={5}
            cols={50}
            disabled
          ></textarea>
        </div>
      </div>
    </div>
  );
}

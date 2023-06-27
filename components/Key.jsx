import { useRef, useEffect, useState } from 'react';

import styles from '../styles/key.module.css';

const Canvas1 = (props) => {
    const canvasRef = useRef(null);
  
      const draw = (ctx) => {
          ctx.fillStyle = '#DD3E3E';
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
          ctx.fillStyle = '#F8B319';
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
          ctx.fillStyle = '#8DBE40';
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

export default function Key() {

    return (
        <div className={styles.sidebar}>
            <button className={styles.drawbutton}>
                <Canvas1 />
                <p className={styles.canvas}> Sitting</p>
            </button>
            <div className={styles.spacing_drawbutton}></div>
            <button className={styles.drawbutton}>
                <Canvas2 />
                <p className={styles.canvas}> Standing</p>
            </button>
            <div className={styles.spacing_drawbutton}></div>
            <button className={styles.drawbutton}>
                <Canvas3 />
                <p className={styles.canvas}> Other</p>
            </button>
        </div>
    );
}
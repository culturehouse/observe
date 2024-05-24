import React, { useRef, useEffect } from "react";
import { useD3 } from "../hooks/useD3";
import * as d3 from "d3";

// these dudes control the density spread
const BANDWIDTH = 15;
//const DOMAINTOP = 0.15; // original
const DOMAINTOP = 0.03;
const DOMAINBOT = 0;
const SCALEFUNC = d3.scaleSqrt;

// Heatmap dimensions
const WIDTH = 558;
const HEIGHT = 558;

// pls don't change IDK how it works :()
const MARGIN = 0;

export function generateSVG(data, backgroundLink) {
  return useD3(
    (div) => {
      var xmax = Math.max(...data.map((o) => o.xcor));
      var ymax = Math.max(...data.map((o) => o.ycor));
      var xmin = Math.min(...data.map((o) => o.xcor));
      var ymin = Math.min(...data.map((o) => o.ycor));

      // console.log ("xmax: " + xmax + "; ymax: " + ymax +
      //              "; xmin: " + xmin + "; ymin: " + ymin );

      var w_xmax = WIDTH - xmax;
      var w_xmin = WIDTH - xmin;
      var h_ymax = HEIGHT - ymax;
      var h_ymin = HEIGHT - ymin;

      var dgwidth = xmax - xmin;
      var dgheight = ymax - ymin;

      // console.log ("w_xmax: " + w_xmax + "; w_xmin; " + w_xmin +
      //              "; h_ymax: " + h_ymax + "; h_ymin: " + h_ymin +
      //              "; dgwidth: " + dgwidth + "; dgheight: " + dgheight);

      var h_dgheight = HEIGHT - dgheight;
      var w_dgwidth = WIDTH - dgwidth;

      // console.log ("h_dgheight: " + h_dgheight + "; w_dgwidth: " + w_dgwidth);

      // altering bottom and right seem to have scaling effects
      // top and left don't
      var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = WIDTH - margin.left - margin.right,
        height = HEIGHT - margin.top - margin.bottom;

      // data = [{ position: "standing", xcor: 50, ycor: 50},
      //                  { position: "sitting", xcor: 0, ycor: 0},
      //                  { position: "sitting", xcor: 0, ycor: HEIGHT},
      //                  { position: "sitting", xcor: WIDTH, ycor: 0},
      //                  { position: "sitting", xcor: WIDTH, ycor: HEIGHT},
      //                  ...data]

      // console.log(data);

      // var xmax = Math.max(...data.map(o => o.xcor));
      // var ymax = Math.max(...data.map(o => o.ycor));
      // var xmin = Math.min(...data.map(o => o.xcor));
      // var ymin = Math.min(...data.map(o => o.ycor));

      // console.log(data);
      // console.log ("xmax: " + xmax + "; ymax: " + ymax +
      //              "xmin: " + xmin + "; ymin: " + ymin );

      var svg = div
        .html("")
        .append("svg")

        // styling density graph svg stuff
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width, height])
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .append("g");
      // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // var _ = svg.append("image")
      //     // .attr("alt", "background sketch")

      //     // style background image
      //     // .attr("xlink:href", backgroundLink)
      //     //.attr("preserveAspectRatio", "None")
      //     // .attr('width', "100%")
      //     // .attr('height', "100%")

      // Add X axis
      // var x = d3.scaleLinear()
      //     .domain([xmin, xmax])
      //     .range([margin.left, width - margin.right]);

      var x = d3
        .scaleLinear()
        .domain([0, 558])
        .range([margin.left, width - margin.right]);

      // Add Y axis
      var y = d3
        .scaleLinear()
        .domain([0, 558])
        .range([height - margin.bottom, 0]);

      const computeDensity = (rgbaColor, predicate) => {
        svg
          .insert("g", "g")
          .selectAll("path")
          .data(
            d3
              .contourDensity()
              .x((d) => {
                return x(d.xcor);
              })
              .y((d) => {
                return y(height - d.ycor);
              })
              .size([width, height])
              .bandwidth(BANDWIDTH)(data.filter(predicate))
          )
          .enter()
          .append("path")
          .attr("d", d3.geoPath())
          .attr("fill", (d) => {
            return SCALEFUNC()
              .domain([DOMAINBOT, DOMAINTOP])
              .range(["rgba(0, 0, 0, 0.0)", rgbaColor])(d.value);
          });
      };

      const computeScales = (data) => {
        const standing = data.filter((o) => o.position == "standing");
        const sitting = data.filter((o) => o.position == "sitting");
        const other = data.filter((o) => o.position == "other");

        if (
          standing.length > sitting.length &&
          standing.length > other.length
        ) {
          return {
            standing_scale: 1.0,
            sitting_scale: (sitting.length * 1.0) / standing.length,
            other_scale: (other.length * 1.0) / standing.length,
          };
        } else if (
          sitting.length > standing.length &&
          sitting.length > other.length
        ) {
          return {
            standing_scale: (standing.length * 1.0) / sitting.length,
            sitting_scale: 1.0,
            other_scale: (other.length * 1.0) / sitting.length,
          };
        } else {
          return {
            standing_scale: (standing.length * 1.0) / other.length,
            sitting_scale: (sitting.length * 1.0) / other.length,
            other_scale: 1.0,
          };
        }
      };

      const { standing_scale, sitting_scale, other_scale } =
        computeScales(data);

      computeDensity(
        `rgba(248, 174, 26, ${standing_scale})`,
        (o) => o.position == "standing"
      );
      computeDensity(
        `rgba(221, 62, 62, ${sitting_scale})`,
        (o) => o.position == "sitting"
      );
      computeDensity(
        `rgba(142, 190, 64, ${other_scale})`,
        (o) => o.position != "standing" && o.position != "sitting"
      );
    },
    [data.length]
  );
}

export default function DensityGraph({ data, backgroundLink }) {
  if (!data) {
    return null;
  }

  const canvasRef = useRef(null);

  const drawCur = () => {
    data.forEach((element) => {
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

  useEffect(drawCur, [data]);

  return <canvas ref={canvasRef} />;

  //   return (
  //     <div
  //       ref={generateSVG(data, backgroundLink)}
  //       style={
  //         {
  //           // height: "30px",
  //           // width: "30px",
  //           // marginRight: "0px",
  //           // marginLeft: "0px",
  //         }
  //       }
  //     />
  //   );
}

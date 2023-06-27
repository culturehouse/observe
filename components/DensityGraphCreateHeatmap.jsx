import { useD3 } from "../hooks/useD3";
import * as d3 from "d3";

import styles from "../styles/create_heatmap.module.css"

// these dudes control the density spread
const BANDWIDTH = 15;
const DOMAINTOP = 0.15;
const DOMAINBOT = 0;
const SCALEFUNC = d3.scaleSqrt;

// Heatmap dimensions
let WIDTH  = 350
let HEIGHT = 350

// pls don't change IDK how it works :()
const MARGIN = 0

export function generateSVG(data, backgroundLink) {
    // WIDTH = !!width ? width : WIDTH;
    // HEIGHT = !!height ? height : HEIGHT;
    return useD3(
        (div) => {
            var margin = { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
                width = WIDTH - margin.left - margin.right,
                height = HEIGHT - margin.top - margin.bottom;
            console.log("in useD3 (DG.jsx), margin.left: " + margin.left + 
                        "; margin.right: " + margin.right +
                        "; margin.top: " + margin.top +
                        "; margin.bottom: " + margin.bottom);
        
            var xmax = Math.max(...data.map(o => o.xcor));
            var ymax = Math.max(...data.map(o => o.ycor));
            var xmin = Math.min(...data.map(o => o.xcor));
            var ymin = Math.min(...data.map(o => o.ycor));
            
            var svg = div
                .html("")
                .append("svg")

                // styling density graph svg stuff
                .attr("width", width + margin.left + margin.right)  
                .attr("height", height + margin.top + margin.bottom)
                .attr("viewBox", [0, 0, width, height])
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            var _ = svg.append("image")
                .attr("alt", "background sketch")
                
                // style background image
                .attr("xlink:href", backgroundLink)
                .attr("preserveAspectRatio", "none") 
                .attr('width', "100%")
                .attr('height', "100%")

            // Add X axis
            // var x = d3.scaleLinear()
            //     .domain([xmin, xmax])
            //     .range([margin.left, width - margin.right]);

            // // Add Y axis
            // var y = d3.scaleLinear()
            //     .domain([ymin, ymax])
            //     .range([height - margin.bottom, margin.top]);

            // should present data absolute rather than relative 
            // (doesn't necessarily fill up canvas)
            var x = d3.scaleLinear()
                .domain([0, 558])
                .range([margin.left, width - margin.right]);

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 558])
                .range([0, height - margin.bottom]);
            

            const computeDensity = (rgbaColor, predicate) => {
                svg.insert("g", "g")
                    .selectAll("path")
                    .data(d3.contourDensity()
                        .x((d) => { return x(d.xcor); })
                        .y((d) => { return y(d.ycor); })
                        .size([width, height])
                        .bandwidth(BANDWIDTH)
                        (data.filter(predicate)))
                    .enter().append("path")
                    .attr("d", d3.geoPath())
                    .attr("fill", (d) => {
                        return SCALEFUNC()
                            .domain([DOMAINBOT, DOMAINTOP])
                            .range(["rgba(0, 0, 0, 0.0)", rgbaColor])
                            (d.value);
                    });
            }

            const computeScales = (data) => {
                const standing = data.filter((o) => o.position == "standing");
                const sitting = data.filter((o) => o.position == "sitting");
                const other = data.filter((o) => o.position == "other");

                if (standing.length > sitting.length && standing.length > other.length) {
                    return {
                        standing_scale: 1.0,
                        sitting_scale: (sitting.length * 1.0 / standing.length),
                        other_scale: (other.length * 1.0 / standing.length)
                    }
                } else if (sitting.length > standing.length && sitting.length > other.length) {
                    return {
                        standing_scale: (standing.length * 1.0 / sitting.length),
                        sitting_scale: 1.0,
                        other_scale: (other.length * 1.0 / sitting.length)
                    }
                } else {
                    return {
                        standing_scale: (standing.length * 1.0 / other.length),
                        sitting_scale: (sitting.length * 1.0 / other.length),
                        other_scale: 1.0
                    }
                }
            }

            const {standing_scale, sitting_scale, other_scale} = computeScales(data);

            computeDensity(`rgba(248, 174, 26, ${standing_scale})`, (o) => o.position == "standing");
            computeDensity(`rgba(221, 62, 62, ${sitting_scale})`, (o) => o.position == "sitting");
            computeDensity(`rgba(142, 190, 64, ${other_scale})`, (o) => o.position != "standing" && o.position != "sitting");

        }, [data.length]
    )
}

export default function DensityGraph({ data, backgroundLink, width, height }) {
    
    if (!data) {
        return (null)
    }

    return (
        <div
            ref={generateSVG(data, backgroundLink, width, height)}
            style={{
                height: "30px",
                width: "30px",
                marginRight: "0px",
                marginLeft: "0px",
            }}
            className={styles.densityGraph}
        >
        </div>
    );
}

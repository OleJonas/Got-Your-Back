import * as React from "react";
import {useState, useEffect} from 'react';
import * as ReactDOM from "react-dom";
import CanvasJSReact from "../../canvasjs.react"

const fs = require('fs');
const papa = require('papaparse');
var Component = React.Component;
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const Visualizer = () => {

    const [datapoints, addDatapoint] = useState([])
    
    function readCSV(){
        
    }

    function print(){
        console.log("hey")
    }

    //useEffect(() => {setInterval(readCSV, 1000)})

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
            text: "Bounce Rate by Week of Year"
        },
        axisY: {
            title: "Bounce Rate",
            suffix: "%"
        },
        axisX: {
            title: "Week of Year",
            prefix: "W",
            interval: 2
        },
        data: [{
            type: "line",
            toolTipContent: "Week {x}: {y}%",
            dataPoints: [
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 },
                { x: 4, y: 2 },
                { x: 5, y: 2 },
                { x: 6, y: 3 },
                { x: 7, y: 3 },
                { x: 8, y: 7 },
                { x: 9, y: 7 },
                { x: 10, y: 5 },
                { x: 11, y: 5 },
            ]
        }]
    }

    return(
        <div>
            <CanvasJSChart options={options}></CanvasJSChart>
        </div>
    )
}

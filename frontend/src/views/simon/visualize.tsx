import * as React from "react";
import {useState, useEffect, useRef} from 'react';
import * as ReactDOM from "react-dom";
import { setConstantValue } from "typescript";
import CanvasJSReact from "../../canvasjs.react"

const fs = require('fs');
const papa = require('papaparse');
var Component = React.Component;
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export const Visualizer = () => {

    const [datapoints, setDatapoint] = useState<Array<Object>>([])
    
    function readCSV(){
        fetch('http://localhost:5000/predictions', {
            headers : {
                'Content-Type': 'application/text',
                'Accept': 'application/text',
                'mode' : 'cors'
            }
        }).then(res => res.json()).then(data => {
            return data
        })
    }

    useEffect(() => {

    }, [])
    
    useEffect(() => {

        let id = setInterval(() => {
            fetch('http://localhost:5000/predictions', {
            headers : {
                'Content-Type': 'application/text',
                'Accept': 'application/text',
            }
            }).then(res => res.json()).then(data => {
                console.log(data['x'])
                data['x'] = new Date(data['x'])
                setDatapoint((datapoints) => {return [...datapoints,data]})
            })
        },3000);
        //return () => clearInterval(id);
    }, []);
    
    useEffect(() => {
        console.log(datapoints)
    },[datapoints])

    let y_labels = ["Upright", "Forward", "Forward-right", "Right", "Back-right", "Back", "Back-left", "Left", "Forward-left"]

    const options = {
        animationEnabled: false,
        exportEnabled: true,
        interactive: false,
        theme: "light2", // "light1", "dark1", "dark2"
        backgroundColor: '#0f3762',
        axisY:{
            labelFormatter: function(e:any) {
                if(e.value == 0 || e.value == 9){
                    return ""
                }
                return y_labels[e.value]
            },
            viewportMinimum: 0,
            viewportMaximum: 9,
            margin: 30,
            labelFontColor: "#EDB93C",
            gridColor: "#EDB93C",
            tickColor: "#EDB93C" ,
            gridThickness: 0,
            lineColor: "#EDB93C",
            labelFontWeight: "Bold",
            labelFontSize: "16",
            lineThickness: 1
        },
        axisX:{
            labelFormatter: function(e:any) {
                return CanvasJS.formatDate(e.value, "HH:mm:ss")
            },
            viewportMinimum: datapoints[0],
            xValueType: 'dateTime',
            labelFontColor: "#EDB93C",
            tickColor: "#EDB93C",
            lineColor: "#EDB93C",
            labelFontWeight: "Bold",
            labelFontSize: "16"
        },
        title:{
            text: "My predictions",
            fontColor: "#EDB93C",
        },
        data: [{
            type: "line",
            xValueType: "dateTime",
            dataPoints : datapoints,
            color: "#EDB93C",
            markerColor: "#EDB93C"
        }]
    }

    return(
        <div>
            <CanvasJSChart key={datapoints.toString()} options={options}></CanvasJSChart>
        </div>
    )
}




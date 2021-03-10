import * as React from "react";
import {useState, useEffect} from 'react';
import CanvasJSReact from "../../canvasjs.react"
import { makeStyles } from '@material-ui/core/styles';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const LineGraph = () => {

    const [datapoints, setDatapoint] = useState<Array<JSON>>([])

    const useStyles = makeStyles({
        root: {
            height: '100%',
            width: '100%',
        },
    })
    
    useEffect(() => {
        setInterval(() => {
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
    }, []);

    let y_labels = ["Upright", "Forward", "Forward-right", "Right", "Back-right", "Back", "Back-left", "Left", "Forward-left"]
    
    const options = {
        animationEnabled: false,
        exportEnabled: false,
        responsive: true,
        maintainAspectRatio: true,
        backgroundColor: 'rgba(0,0,0,0)',
        axisY:{
            labelFormatter: function(e:any) {
                if(e.value == 0 || e.value == 9){
                    return ""
                }
                return y_labels[e.value]
            },
            viewportMinimum: 0,
            viewportMaximum: 9,
            labelFontColor: "#EDB93C",
            gridColor: "#EDB93C",
            tickColor: "#EDB93C" ,
            gridThickness: 0,
            lineColor: "#EDB93C",
            labelFontWeight: "Bold",
            lineThickness: 1,
            interval: 1
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
        },
        data: [{
            type: "line",
            xValueType: "dateTime",
            dataPoints : datapoints,
            color: "#EDB93C",
            markerColor: "#EDB93C"
        }]
    }
    const classes = useStyles();

    const containerProps = {
        height: "100%"
    };

    return(
        <div className={classes.root}>
            <CanvasJSChart containerProps={containerProps} key={datapoints.toString()} options={options}></CanvasJSChart>
        </div>
    )
}




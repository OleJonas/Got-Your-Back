import {FC, useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CanvasJSReact from "../../canvasjs.react"
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

type MyProps = {
    data : Array<JSON>
}

export const LineGraph: FC<MyProps> = (props: MyProps) => {
    const classes = useStyles();
    const [datapoints, setDatapoint] = useState<Array<JSON>>(props.data)

    useEffect(() => {
        setDatapoint(props.data)
    },[props.data])

    let y_labels = ["Upright", "Forward", "Forward-right", "Right", "Back-right", "Back", "Back-left", "Left", "Forward-left"]
    
    const options = {
        toolTip : {
            contentFormatter: function(e:any) {
                let time = CanvasJS.formatDate(e.entries[0].dataPoint.x, "HH:mm:ss")
                return time + ": " + e.entries[0].dataPoint.y
            }
        },
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
            interval: 1,
            margin: 15
        },
        axisX:{
            labelFormatter: function(e:any) {
                return CanvasJS.formatDate(e.value, "HH:mm:ss")
            },
            viewportMinimum: datapoints[0],
            xValueType: 'dateTime',
            labelFontColor: "#EDB93C",
            margin: 15,
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

    const containerProps = {
        height: "100%"
    };

    return(
        <div className={classes.root}>
            <CanvasJSChart containerProps={containerProps} options={options}></CanvasJSChart>
        </div>
    )
}

const useStyles = makeStyles({
    root: {
        height: '100%',
        width: '100%',
    },
})




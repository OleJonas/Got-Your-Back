import { Grid, Box, makeStyles, Typography } from '@material-ui/core';
import { useState, useEffect } from 'react';

// Components
import { NavBar } from '../../components/NavBar/NavBar.component'
import { ContentBox } from '../../components/ContentBox/ContentBox.component'
import { LineGraph } from '../../components/LineGraph/LineGraph'
import { SensorModal } from '../../components/SensorModal/SensorModal.component';
import { GoogleGraph } from '../../components/GoogleGraph/GoogleGraph.jsx';
import { ClassificationBox } from '../../components/ClassificationContent/ClassificationBox'
import { SamplingRateContent } from '../../components/SamplingRateContent/SamplingRateContent'

export const HomeView = () => {

    const [datapoints, setDatapoint] = useState<Array<JSON>>([])
 
    useEffect(() => {
        let data_array:Array<JSON> = []
        fetch('http://localhost:5000/all_predictions', {
            headers : {
                'Content-Type': 'application/text',
                'Accept': 'application/text',
            }
            }).then(res => res.text()).then(text => {
                let array = text.split("\n")
                
                array.forEach(data => {
                    if(data !== ""){
                        let jsonobject = JSON.parse(data)
                        jsonobject['x'] = new Date(jsonobject['x'])
                        jsonobject['y'] = parseInt(jsonobject['y'],10)
                        data_array.push(jsonobject)
                    }
                });

                }).then(() => {console.log(data_array);
                               setDatapoint(() => {return data_array})});
                
                //data['x'] = new Date(data['x'])
                //setDatapoint((datapoints) => {return [...datapoints,data]})
            
    },[])


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
    }, [])

    useEffect(() => {
        console.log("datapoints: ", datapoints)
    },[datapoints])


    const classes = useStyles();
    return (
        <>
            <Grid container justify="center" className={classes.root} >
                <Grid item xs={2} md={1} lg={1} >
                    <NavBar></NavBar>
                </Grid>
                <Grid item xs={10} md={11} lg={11} className={classes.height}>
                    <Grid container spacing={2} className={classes.grid}>
                        <Grid item xs={12}><Typography variant="h1" color="textPrimary">Welcome Back, Ole Jonas!</Typography></Grid>    

                        <Grid item xs={12} md={5} className={classes.components}>
                            <Box mb={0.6}><Typography variant="h3" color="textPrimary">Connected sensors</Typography></Box>
                            <ContentBox><SensorModal /></ContentBox>
                        </Grid>
                        
                        <Grid item xs={6} md={4} className={classes.components}>
                            <Box mb={0.6}><Typography variant="h3" color="textPrimary">Classification</Typography></Box>
                            <ContentBox><ClassificationBox datapoint={datapoints[datapoints.length-1]}></ClassificationBox></ContentBox>
                        </Grid>
                        <Grid item xs={6} md={3} justify="center" alignItems="center" className={classes.components}>
                            <Box mb={0.6}><Typography variant="h3" color="textPrimary">Sample rate</Typography></Box>
                            <ContentBox><SamplingRateContent></SamplingRateContent></ContentBox>
                        </Grid>
                        <Grid item xs={12} md={7} className={classes.components}>
                            <Box mb={0.6}><Typography variant="h3" color="textPrimary">My day</Typography></Box>
                            <ContentBox>{<LineGraph data={datapoints}></LineGraph>}</ContentBox>
                        </Grid>
                        <Grid item xs={12} md={5} className={classes.components}>
                            <Box mb={0.6}><Typography variant="h3" color="textPrimary">Distribution</Typography></Box>
                            <ContentBox></ContentBox>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

const useStyles = makeStyles({
    root: {
        height: "100%"
    },
    grid: {
        height: "100%",
        padding: "20px",
        overflow: "auto"
    },
    components: {
        minHeight: "300px",
        height: "40vh"
    },
    height: {
        height: "100%"
    }
});
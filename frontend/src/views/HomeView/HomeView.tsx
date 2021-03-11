import { Grid, Box, makeStyles, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";

// Components
import { NavBar } from "../../components/NavBar/NavBar.component";
import { ContentBox } from "../../components/ContentBox/ContentBox.component";
import { SensorModal } from "../../components/SensorModal/SensorModal.component";
import { ClassificationBox } from "../../components/ClassificationContent/ClassificationBox";
import { LineChart } from "../../components/LineChart/LineChart.component.jsx";
import { PieChart } from "../../components/PieChart/PieChart.component.jsx";
import { SamplingRateContent } from "../../components/SamplingRateContent/SamplingRateContent";

export const HomeView = () => {
  const classes = useStyles();
  const [datapoints, setDatapoints] = useState<any>({
    "1998-09-10 08:25:50": "1",
  });

  useEffect(() => {
    fetch("http://localhost:5000/all_predictions", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDatapoints(data);
      });
  }, []);

  /*
	useEffect(() => {
		setInterval(() => {
			fetch("http://localhost:5000/prediction", {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					let key = Object.keys(data)[0];
					let val = Object.values(data)[0];
					let tmp = datapoints;
					tmp[key] = val;
					setDatapoints(tmp);
				});
		}, 3000);
	}, []);
    */

  return (
    <>
      <Grid container justify="center" className={classes.root}>
        <Grid item xs={2} md={1} lg={1}>
          <NavBar></NavBar>
        </Grid>
        <Grid item xs={10} md={11} lg={11} className={classes.height}>
          <Grid container spacing={2} className={classes.grid}>
            <Grid item xs={12}>
              <Typography variant="h1" color="textPrimary">
                Welcome Back, Ole Jonas!
              </Typography>
            </Grid>

            <Grid item xs={12} md={5} className={classes.infoContainer}>
              <Box mb={0.6}>
                <Typography variant="h3" color="textPrimary">
                  Connected sensors
                </Typography>
              </Box>
              <ContentBox>
                <SensorModal />
              </ContentBox>
            </Grid>

            <Grid item xs={6} md={4} className={classes.infoContainer}>
              <Box mb={0.6}>
                <Typography variant="h3" color="textPrimary">
                  Classification
                </Typography>
              </Box>
              <ContentBox>{/*<ClassificationBox datapoint={datapoints[datapoints.length-1]}></ClassificationBox>*/}</ContentBox>
            </Grid>
            <Grid item xs={6} md={3} justify="center" alignItems="center" className={classes.infoContainer}>
              <Box mb={0.6}>
                <Typography variant="h3" color="textPrimary">
                  Sample rate
                </Typography>
              </Box>
              <ContentBox>
                <SamplingRateContent></SamplingRateContent>
              </ContentBox>
            </Grid>
            <Grid item xs={12} md={7} className={classes.graphContainer}>
              <Box mb={0.6}>
                <Typography variant="h3" color="textPrimary">
                  My day
                </Typography>
              </Box>
              <ContentBox>
                <LineChart data={datapoints} />
              </ContentBox>
            </Grid>
            <Grid item xs={12} md={5} className={classes.graphContainer}>
              <Box mb={0.6}>
                <Typography variant="h3" color="textPrimary">
                  Distribution
                </Typography>
              </Box>
              <ContentBox>
                <PieChart data={datapoints} />
              </ContentBox>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  grid: {
    height: "100%",
    padding: "20px",
    overflow: "auto",
  },
  infoContainer: {
    minHeight: "300px",
  },
  graphContainer: {
    height: "400px",
  },
  height: {
    height: "100%",
  },
});

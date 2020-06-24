import React, { Component, useCallback, useEffect, useState } from 'react'
import { Grid, createStyles, Theme, Typography, useTheme, makeStyles } from '@material-ui/core'
import {ResponsiveLine, Serie} from '@nivo/line'


const styles = makeStyles((theme) => ({
  chartRoot: {
      padding: theme.spacing(6),
      borderRadius: theme.spacing(2),
      backgroundColor: "white",
      width: 620,
      height: 240,
      border: "1px solid rgba(0,0,0,0.15)",
      transition: "box-shadow 0.3s ease-in-out",
      "&:hover": {
          border: "1px solid " + theme.palette.primary.main,
          boxShadow: "0px 5px 15px rgba(0,0,0,0.1)"
      }
  },
  toolTip: {
      backgroundColor: "white",
      border: "2px solid " + theme.palette.primary.main,
      borderRadius: theme.spacing(2),
      padding: theme.spacing(2),
      fontFamily: "Helvetica",
      fontSize: 12,
      color: theme.palette.primary.main,
      fontWeight: "bold",
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
      marginBottom: theme.spacing(2),
  }
}))




const Home = () => {
  const theme = useTheme();
 
    
  const classes = styles();
  const light = theme.palette.primary.main;
  const dark = theme.palette.primary.dark;
  const [series, setSeries] = useState([])
  
  const loadSeriesData = () => {
    const url = '/measurements'
    fetch(url)
    .then((response) => {
      if(response.ok) {
        return response.json()
      }
      console.log("Error")
    }).then((data) => {
      console.log(JSON.stringify(data))

      setSeries([{
        id: 'Temperature',
        data: data.map((reading) => {
          return {
            x: reading.dateUpdated,
            y: reading.temperature
          }
        })
      }])
    })
  }

  useEffect(() => {
    loadSeriesData()
  })

  const chartTheme = useCallback(() => {
    return {
        grid: {
            line: {
                stroke: "rgba(0,0,0,0.05)",
            }
        },
        axis: {
            legend: {
                text: {
                    fill: dark,
                    fontSize: 12,
                }
            },
            ticks: {
                text: {
                    fill: "rgba(0,0,0,0.3)",
                    fontSize: 12,
                },
                line: {
                    stroke: "rgba(0,0,0,0.3)",
                    strokeWidth: 1,
                }
            },
            domain: {
                line: {
                    stroke: "rgba(0,0,0,0.1)",
                    strokeWidth: 1,
                }
            },
        },
        crosshair: {
            line: {
                stroke: 'rgba(0,0,0,0.5)',
                strokeWidth: 1,
                strokeOpacity: 0.35,
            },
        }
    }
}, []);
  
const yScale = {
      type: "linear",
      min: 0,
      max: 35,
};

const xScale = {
  type: "time",
  precision: "hour",
  format: "%Y-%m-%dT%H:%M:%S.%L%Z",
};

const axisBottom = {
  format: "%H:%M",
  tickValues: 5,
};

const axisLeft = {
  legend: "Temperature",
  legendOffset: -32,
  legendPosition: "middle",
  tickSize: 0,
  tickValues: 2,
  tickPadding: 4,
};

let margin = {
  top: 10,
  right: 0,
  bottom: 30,
  left: 40
};

  return (
    <div>
      <Typography variant="h3">Home Office Temperature 🥵</Typography>
      <Grid container>
        <Grid item className={classes.chartRoot}>

          <ResponsiveLine
              curve={"monotoneX"}
              data={series}
              theme={chartTheme()}
              colors={[dark]}
              margin={margin}
              yScale={yScale}
              xScale={xScale}
              xFormat="time:%Y-%m-%dT%H:%M:%S.%L%Z"
              axisBottom={axisBottom}
              axisLeft={axisLeft}
              lineWidth={1}
              pointSize={0}
              useMesh={true}
          />
        </Grid>
      </Grid>
    </div>
  )

}

export default Home
import React, { useCallback, useEffect, useState } from 'react'
import { Grid, Typography, useTheme, makeStyles, Box } from '@material-ui/core'
import { ResponsiveLine } from '@nivo/line'

// #CFF09E,#A8DBA8,#79BD9A,#3B8686,#0B486B
const styles = makeStyles((theme) => ({
  page: {
    position: 'absolute',
    margin: '0 !important',
    left: '0',
    minWidth: '320px',
    width: '100%',
/*  [theme.breakpoints.down('xs')]: {
      margin: '0 !important',
      left: '0',
      minWidth: '320px',
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      left: '50%',
      transform: 'translateX(-50%)',
    },
*/
    top: '60px',
    color: '#CFF09E',
    //padding: theme.spacing(1)
  },
  header: {
    color: '#CFF09E',
  },
  footer: {
    color: '#0B486B',
  },
  container: {
    width: '100%',
  },

  chartContainer: {
    width: '100%',
    height: '100%',
    margin: '0 !important',
  },

  chartRoot: {
    padding: theme.spacing(4),
    margin: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: "#f3ffe2",
    width: '100%',
    minWidth: '320px',
    height: '280px',
    border: "1px solid #0B486B",
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
  const dark = theme.palette.primary.dark;
  const [series, setSeries] = useState([])
  const [humiditySeries, setHumiditySeries] = useState([])
  const [currentTemperature, setCurrentTemperature] = useState()

  const loadSeriesData = () => {
    const url = '/measurements'
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        console.log("Error")
      }).then((data) => {
        setSeries([{
          id: 'Temperature',
          data: data.map((reading) => {
            return {
              x: new Date(reading.dateUpdated),
              y: reading.temperature
            }
          })
        }])

        setHumiditySeries([{
          id: 'Humidity',
          data: data.map((reading) => {
            return {
              x: new Date(reading.dateUpdated),
              y: reading.humidity
            }
          })
        }])

        // Get last value as current temperature
        const lastItem = data.pop();
        setCurrentTemperature(lastItem.temperature)
      })
  }

  useEffect(() => {
    loadSeriesData()
  }, [])

  const chartTheme = useCallback(() => {
    return {
      grid: {
        line: {
          stroke: "rgba(0,0,0,0.04)",
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
            stroke: "#0B486B",
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
  }, [dark]);

  const yScale = {
    type: "linear",
    min: 20,
    max: 32,
  };

  const xScale = {
    type: "time",
    precision: "hour",
    format: "native",
  };

  const axisBottom = {
    format: "%H:%M",
    tickValues: 5,
  };

  const axisLeft = {
    legend: "Temperature °C",
    legendOffset: -32,
    legendPosition: "middle",
    tickSize: 2,
    tickValues: 2,
    tickPadding: 4,
  };

  let margin = {
    top: 10,
    right: 0,
    bottom: 20,
    left: 40
  };

  return (
    <div className={classes.page}>
      <Grid container className={classes.container} spacing={0} justify="center" alignItems="center" >
        <Grid item xs={12} container justify="center" alignItems="center" direction="column">          
          <Typography variant="h4" className={classes.header}>Tommi's Home Office</Typography>
          <Box m={2} />
          <Typography variant="h2">{currentTemperature}°C <span role="img" aria-label="Sweating emoji">🥵</span></Typography>
          <Box m={2} />
        </Grid>
        <Grid xs={4} item container justify="center" alignItems="center" direction="column" className={classes.chartRoot}>
          <div className={classes.chartContainer}>
            <ResponsiveLine
              curve={"monotoneX"}
              data={series}
              theme={chartTheme()}
              colors={[dark]}
              margin={margin}
              yScale={yScale}
              xScale={xScale}
              xFormat="time:%H:%M"
              axisBottom={axisBottom}
              axisLeft={axisLeft}
              //lineWidth={1}
              pointSize={0}
              useMesh={true}
            />
          </div>
          <Box m={1} />
        </Grid>
        <Grid item xs={4} container justify="center" alignItems="center" direction="column" className={classes.chartRoot}>
          <div className={classes.chartContainer}>
            <ResponsiveLine
              curve={"monotoneX"}
              data={humiditySeries}
              theme={chartTheme()}
              colors={[dark]}
              margin={margin}
              yScale={{
                type: "linear",
                min: 0,
                max: 100,
              }}
              xScale={xScale}
              xFormat="time:%H:%M"
              axisBottom={axisBottom}
              axisLeft={{
                legend: "Humidity %",
                legendOffset: -32,
                legendPosition: "middle",
                tickSize: 2,
                tickValues: 2,
                tickPadding: 4,
              }}
              //lineWidth={1}
              pointSize={0}
              useMesh={true}
            />
          </div>
        </Grid>
        <Grid item xs={12} container justify="center" alignItems="center" direction="column">
          <span className={classes.footer}>Copyright &copy; Tommi Laukkanen</span>
        </Grid>
      </Grid>
    </div>
  )

}

export default Home
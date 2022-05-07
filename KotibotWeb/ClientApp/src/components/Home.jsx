import React, { useCallback, useEffect, useState } from 'react'
import {
  Grid, Typography, useTheme, makeStyles, Paper, useMediaQuery,
} from '@material-ui/core'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { ResponsiveLine } from '@nivo/line'

// #CFF09E,#A8DBA8,#79BD9A,#3B8686,#0B486B
const styles = makeStyles((theme) => ({
  page: {
    flexGrow: 1,
    padding: theme.spacing(2),
    top: '60px',
    color: '#CFF09E',
  },
  header: {
    color: '#3B8686',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  footer: {
    color: '#0B486B',
  },

  titleRoot: {
    width: '100%',
    height: '140px',
  },

  titleContainer: {
    height: '70px',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    backgroundColor: '#f3ffe266',
    margin: 'auto',
  },

  chartContainer: {
    height: '260px',
    margin: '0 !important',
    backgroundColor: '#f3ffe2',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
  },

  chartRoot: {
    width: '100%',
    height: '330px',
    transition: 'box-shadow 0.3s ease-in-out',
  },
  toolTip: {
    backgroundColor: 'white',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
    marginBottom: theme.spacing(2),
  },
}))

const Home = () => {
  const theme = useTheme()
  const classes = styles()
  const betweenSmallAndLarge = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const { dark } = theme.palette.primary
  const [series, setSeries] = useState([])
  const [humiditySeries, setHumiditySeries] = useState([])
  const [pressureSeries, setPressureSeries] = useState([])
  const [currentTemperature, setCurrentTemperature] = useState()
  const [currentHumidity, setCurrentHumidity] = useState()

  const loadSeriesData = () => {
    const url = '/measurements'
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw Error('Not ok')
      }).then((data) => {
        if (!data) {
          return
        }
        setSeries([{
            id: 'Office',
            data: data.filter((entry) => entry.location === 'Office').map((reading) => ({
              x: new Date(reading.dateUpdated),
              y: reading.temperature,
            })),
          }, {
            id: 'Bedroom',
            data: data.filter((entry) => entry.location === 'Bedroom').map((reading) => ({
                x: new Date(reading.dateUpdated),
                y: reading.temperature,
            })),
          },
        ])

        setHumiditySeries([{
          id: 'Office',
          data: data.filter((entry) => entry.location === 'Office').map((reading) => ({
              x: new Date(reading.dateUpdated),
              y: reading.humidity,
            })),
        }])

        setPressureSeries([{
          id: 'Office',
          data: data.filter((entry) => entry.location === 'Office').map((reading) => ({
              x: new Date(reading.dateUpdated),
              y: reading.pressure,
            })),
        }])

        // Get last value as current temperature and humidity
        const lastItem = data.filter((entry) => entry.location === 'Office').pop()
        if (lastItem) {
          setCurrentTemperature(lastItem.temperature)
          setCurrentHumidity(lastItem.humidity)
        }
      }).catch(() => {
        // console.error('Error while loading data')
      })
  }

  const fiveMinutesInMs = 300000

  useEffect(() => {
    loadSeriesData()
    const interval = setInterval(() => {
      loadSeriesData()
    }, fiveMinutesInMs)
    return () => loadSeriesData(interval)
  }, [])

  const chartTheme = useCallback(() => ({
      grid: {
        line: {
          stroke: 'rgba(0,0,0,0.04)',
        },
      },
      axis: {
        legend: {
          text: {
            fill: dark,
            fontSize: 12,
          },
        },
        ticks: {
          text: {
            fill: 'rgba(0,0,0,0.3)',
            fontSize: 12,
          },
          line: {
            stroke: '#0B486B',
            strokeWidth: 1,
          },
        },
        domain: {
          line: {
            stroke: 'rgba(0,0,0,0.1)',
            strokeWidth: 1,
          },
        },
      },
      crosshair: {
        line: {
          stroke: 'rgba(0,0,0,0.5)',
          strokeWidth: 1,
          strokeOpacity: 0.35,
        },
      },
    }), [dark])

  const yScale = {
    type: 'linear',
    min: 18,
    max: 32,
  }

  const xScale = {
    type: 'time',
    precision: 'minute',
    format: 'native',
  }

  const axisBottom = {
    format: '%H:%M',
    tickValues: 5,
  }

  const axisLeft = {
    legend: 'Temperature °C',
    legendOffset: -32,
    legendPosition: 'middle',
    tickSize: 2,
    tickValues: 2,
    tickPadding: 4,
  }

  const margin = {
    top: 10,
    right: 0,
    bottom: 25,
    left: 42,
  }

  return (
    <HelmetProvider>
      <div className={classes.page}>
        <Grid container className={classes.container} spacing={3}>
          <Grid item xs={12} sm={6} className={classes.titleRoot}>
            <Paper className={classes.titleContainer}>
              <div className={classes.header}>
                <Typography variant={betweenSmallAndLarge ? 'h6' : 'h5'} align="center">
                  Office
                </Typography>
                <Typography variant={betweenSmallAndLarge ? 'h3' : 'h2'} align="center">
                  {currentTemperature?.toFixed(1)}
                  °C
                  &nbsp;
                  {(currentTemperature > 26) &&
                  <span role="img" aria-label="Sweating emoji">
                    🥵
                  </span> }
                </Typography>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.titleRoot}>
            <Paper className={classes.titleContainer}>
              <div className={classes.header}>
                <Typography variant={betweenSmallAndLarge ? 'h6' : 'h5'} align="center">
                  Indoors Humidity
                </Typography>
                <Typography variant={betweenSmallAndLarge ? 'h3' : 'h2'} align="center">
                  {currentHumidity}
                  %
                  &nbsp;
                  {(currentHumidity > 70) &&
                  <span role="img" aria-label="Sweating emoji">
                    🥵
                  </span> }
                </Typography>
              </div>
            </Paper>
          </Grid>
          <Grid
              xs={12}
              lg={4}
              item
              className={classes.chartRoot}
          >
            <Paper className={classes.chartContainer}>
              <ResponsiveLine
                curve="monotoneX"
                data={series}
                theme={chartTheme()}
                // colors={[dark]}
                margin={margin}
                yScale={yScale}
                xScale={xScale}
                xFormat="time:%H:%M"
                axisBottom={axisBottom}
                axisLeft={axisLeft}
                // lineWidth={1}
                pointSize={0}
                useMesh
                legends={[
                  {
                    anchor: 'top',
                    direction: 'row',
                    justify: false,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                  },
                ]}
              />
            </Paper>
          </Grid>
          <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              className={classes.chartRoot}
          >
            <Paper className={classes.chartContainer}>
              <ResponsiveLine
                curve="monotoneX"
                data={humiditySeries}
                theme={chartTheme()}
                // colors={[dark]}
                margin={margin}
                yScale={{
                  type: 'linear',
                  min: 0,
                  max: 100,
                }}
                xScale={xScale}
                xFormat="time:%H:%M"
                axisBottom={axisBottom}
                axisLeft={{
                  legend: 'Humidity %',
                  legendOffset: -32,
                  legendPosition: 'middle',
                  tickSize: 2,
                  tickValues: 2,
                  tickPadding: 4,
                }}
                // lineWidth={1}
                pointSize={0}
                useMesh
              />
            </Paper>
          </Grid>
          <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              className={classes.chartRoot}
          >
            <Paper className={classes.chartContainer}>
              <ResponsiveLine
                curve="monotoneX"
                data={pressureSeries}
                theme={chartTheme()}
                // colors={[dark]}
                margin={margin}
                yScale={{
                  type: 'linear',
                  min: 975,
                  max: 1025,
                }}
                xScale={xScale}
                xFormat="time:%H:%M"
                axisBottom={axisBottom}
                axisLeft={{
                  legend: 'Pressure hPa',
                  legendOffset: -36,
                  legendPosition: 'middle',
                  tickSize: 2,
                  tickValues: 2,
                  tickPadding: 4,
                }}
                // lineWidth={1}
                pointSize={0}
                useMesh
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.titleRoot}>
            <Paper className={classes.titleContainer}>
              <Typography
                variant={betweenSmallAndLarge ? 'h5' : 'h4'}
                className={classes.header}
                align="center"
              >
                  🤖 Telegram bot: ONLINE
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.titleRoot}>
            <Paper className={classes.titleContainer}>
              <Typography
                variant={betweenSmallAndLarge ? 'h5' : 'h4'}
                className={classes.header}
                align="center"
              >
                  🩺 No anomalies detected
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} container justifyContent="center" alignItems="center" direction="column">
            <span className={classes.footer}>Copyright &copy; Tommi Laukkanen</span>
          </Grid>
        </Grid>
        <Helmet>
          <title>
            {`${currentTemperature?.toFixed(1)} °C KotiBot`}
          </title>
        </Helmet>
      </div>
    </HelmetProvider>
  )
}

export default Home

import {
  AppBar, Box, Button, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography,
} from '@material-ui/core'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import MenuIcon from '@material-ui/icons/Menu'
import DateRangeIcon from '@material-ui/icons/DateRange'

// #CFF09E,#A8DBA8,#79BD9A,#3B8686,#0B486B
const styles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#79BD9A',
    color: theme.palette.text.secondary,
  },
  timespanPaper: {
    marginLeft: 'auto',
    maxWidth: '400px',
    padding: '6px',
    paddingLeft: '12px',
    paddingRight: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
    backgroundColor: '#A8DBA8',
    borderRadius: '5px',
    border: '1px solid #79BD9A',
    boxShadow: '0px 1px 0px #3B8686',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  timespanContainer: {
    marginLeft: 'auto',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      left: '100%',
      marginLeft: '-200px',
    },
    [theme.breakpoints.up('sm')]: {
      left: '50%',
      marginLeft: '-100px',
    },
    width: '200px',
    marginTop: 'auto',
    marginBottom: 'auto',
    position: 'absolute',
  },
}))

const timeRangeOptions = [
  'Last 24 hours',
  'Last 48 hours',
]

const timeRangeHours = [
  24,
  48,
]

function TopMenu({ setTimeRangeHours }) {
  const classes = styles()
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(1)

  const handleClickTimeRangeItem = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseTimeRange = () => {
    setAnchorEl(null)
  }

  const handleChangeTimeRange = (event, index) => {
    setSelectedIndex(index)
    setTimeRangeHours(timeRangeHours[index])
    handleCloseTimeRange()
  }

  return (
    <AppBar position="static" className={classes.appbar}>
      <Toolbar>
        <IconButton edge="start" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          KotiBot
        </Typography>
        <div className={classes.headerTitle}>
          <Typography variant="h5">
            Tommi&apos;s Crib 🏡
          </Typography>
        </div>

        <Box className={classes.timespanContainer} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button
            edge="start"
            aria-label="date range"
            startIcon={<DateRangeIcon />}
            variant="outlined"
            onClick={handleClickTimeRangeItem}
          >
            <Typography variant="subtitle1">{timeRangeOptions[selectedIndex]}</Typography>
          </Button>
          <Menu
            id="time-range-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseTimeRange}
          >
            {timeRangeOptions.map((option, index) => (
              <MenuItem
                key={option}
                selected={index === selectedIndex}
                onClick={(event) => handleChangeTimeRange(event, index)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

TopMenu.propTypes = {
  setTimeRangeHours: PropTypes.func.isRequired,
}

export default TopMenu

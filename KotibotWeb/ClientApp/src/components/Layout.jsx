import React from 'react'
import PropTypes from 'prop-types'

const Layout = (props) => {
  const { children } = props

  return (
    <div>
      {children}
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

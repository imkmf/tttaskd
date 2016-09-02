import React, { PropTypes } from 'react'

export const Icon = (props) => (
  <i className={`icon ${props.name}`} {...props}></i>
)

Icon.propTypes = {
  name: PropTypes.string
}

export default Icon

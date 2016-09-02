import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

class SharedSelect extends React.Component {
  render () {
    const { createable, field } = this.props
    return <Select
      {...this.props}
      onBlur={(obj) => {
        if (obj.target) { return }
        obj.value ? field.onBlur(obj.value) : field.onBlur(obj)
      }}
      onChange={(obj) => {
        if (obj.target) { return }
        obj.value ? field.onChange(obj.value) : field.onBlur(obj)
      }}
      value={field.value}
    />
  }
}

export default SharedSelect

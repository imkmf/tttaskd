import React, { Component, PropTypes } from 'react'
import ReactMarkdown from 'react-markdown'

export default class Text extends Component {
  render () {
    const { text } = this.props
    return (
      <ReactMarkdown
        allowedTypes={['Text', 'Emph', 'Code', 'Strong', 'Link', 'Paragraph']}
        renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}}
        skipHtml={true}
        source={text}
      />
    )
  }
}

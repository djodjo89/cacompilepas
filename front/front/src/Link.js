import React from 'react';

class Link extends React.Component {
  render() {
    return(
      <a href={ this.props.to } id={ this.props.id } className={ this.props.className }>{ this.props.content }</a>
    )
  }
}

export default Link;
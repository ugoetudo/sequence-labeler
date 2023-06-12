import React from 'react';

class Token extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        tid:this.props.index,
        tokentext:this.props.value,
        isselected:false,
        isclickable:this.props.clickable,
        bio:'O'
      }
    }
  
    sendState() {
      const isselected = this.state.isselected;
      this.setState({isselected:!isselected});
      const tid = this.state.tid;
      const tokentext = this.state.tokentext;
      this.props.onSelected(tid, tokentext)
    }
  
    render () {
      return(
      <button onClick={() => this.sendState()} className={this.state.isselected === false ? 'square-btn' : this.state.isclickable === true ? 'square-btn-selected': 'square-btn'}>
        {this.state.tokentext}
      </button>
    )}
}

export default Token;
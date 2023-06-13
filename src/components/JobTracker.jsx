import React from 'react';

class JobTracker extends React.Component {
  /*
    callAPI() {
      var out = ''; 
      fetch(`https://opim-big-data-analytics.ue.r.appspot.com//testAPI/getPositionInHIT?htid=${this.props.htid}`)
        .then(res => res.json()).then(data => {
          this.setState({curr: data});
          this.setState({responseReady: true});
        });
    }
  
    componentDidMount() {
      this.callAPI()
    }
  */
    render() { 
  
      return (
        <p>{`Sentence `}<strong>{this.props.curr_rank}</strong> {`of`} <strong>{`${this.props.total_num}`}</strong></p>
      )
    
    }
  
  }


export default JobTracker;
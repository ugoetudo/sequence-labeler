import React from 'react';
import ReactDOM from 'react-dom';
import DataFrame from 'dataframe-js';
import './index.css';
//import App from './App';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid';
import Navigation from './components/Navigation';

const api_base_url = 'https://opim-big-data-analytics.ue.r.appspot.com';
//const api_base_url = 'http://localhost:9000'
const api_name = 'entity_recog';


class HIT extends React.Component {
  //this class handles data interchange for the display of the correct observation
  //at any state of the application. it parameterizes the Navigation component
  constructor(props){
    super(props);
    this.state = {
      hitid: null,
      observations: null,
      responseReady: true,
      turkid: null,
      redirect_to_submit: null,
      annotations: null,
      hit_length: 0,
    };
    this.url_query = new URLSearchParams(this.props.location.search);
    this.getNext = this.getNext.bind(this);
    this.getLast = this.getLast.bind(this);
    //this.submitHIT = this.submitHIT.bind(this);
  }

  //a good way to think of callAPI is as the refresher. it makes sure that
  //whenever it is called, the next to be annotated observation is served up
  callAPI() {
    this.setState({responseReady:false});
    const api_url = `${api_base_url}/${api_name}/getObservation?hitid=${this.url_query.get('htid')}`+
    `&turkid=${this.url_query.get('workerId')}`;
    const status_call = `${api_base_url}/${api_name}/HITLength?hitid=${this.url_query.get('htid')}`;
    console.log(api_url);
    fetch(api_url).then(res => res.json())
        .then(data => {
          console.log(data);
          //expect data to have sid, tkid, token_text, rank_value
          this.setState({observations: data});
          this.setState({responseReady: true});
      }).then(fetch(status_call).then(res => res.json()).then(data => {
        console.log(data)
        this.setState({hit_length: data[0].cnt})
        }));
  }
  
  componentDidMount() {
    //upon initial load, we want to make sure that there is a call to get the
    //current valid hit
    this.callAPI();
  }

  getNext(annotations) {
    const api_url = `${api_base_url}/entity_recog/submitAnnotation?hitid=${this.url_query.get('htid')}`+
                    `&turkid=${this.url_query.get('workerId')}`+
                    `&tkids=${JSON.stringify(annotations)}&sid=${this.state.observations[0].sid}`;
    console.log(api_url);
    fetch(api_url).then(res => res.json()).then(data => {
      if (data.status == 'OK') {
        this.callAPI();
      }
    });
  }
  getLast() {
    var rank_value = this.state.observations[0].rank_value;
    if (rank_value > 1) {
      this.setState({responseReady:false});
      const api_url = `${api_base_url}/entity_recog/getObservationByRank?hitid=${this.url_query.get('htid')}`+
                      `&value_rank=${rank_value}&turkid=${this.url_query.get('workerId')}`;
      console.log(api_url);
      fetch(api_url).then(res => res.json()).then(data => {
        console.log(data); 
        this.setState({observations: data[1]});
        this.setState({responseReady:true});
        this.setState({annotations: data[0]});
      });
    }
  }

  render() {
    /*
    if (this.state.redirect_to_submit) {
      return (
        <Redirect to={this.state.redirect_to_submit} ></Redirect>
      );
    }
    */
    if (this.state.responseReady && this.state.observations && this.state.hit_length > 0) {
      return (
        //Navigation should look similar to Observation from the google place
        <div>
          <Navigation 
            tokens={this.state.observations}
            annotations={this.state.annotations}
            hit_length={this.state.hit_length}
            rank_val={this.state.observations[0].rank_value}
            onNextClick={this.getNext}
            onBackClick={this.getLast} 
            assignmentId={this.url_query.get('assignmentId')}/>
          
        </div>
      );
    } else if (!this.state.observations) {
      return (<p>this HIT is complete!! please close this window.</p>)
    } else
    {
      return (
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
      );
    }
  }
}

ReactDOM.render(
  <Router>
    <div>
      <Route exact path='/entity_recog' component={HIT}/>
    </div>
  </Router>,
  document.getElementById('root')
);
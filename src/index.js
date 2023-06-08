import React from 'react';
import ReactDOM from 'react-dom';
import DataFrame from 'dataframe-js'
import Instructions from './instructions'
import './index.css';
//import App from './App';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid';

//const api_base_url = 'https://opim-big-data-analytics.ue.r.appspot.com';
const api_base_url = 'http://localhost:9000'
const api_name = 'entity_recog';
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

class Annotation extends React.Component {
  clear_annotation(k) {
    var del_id = k.target.attributes.id.value;
    this.props.clear_annotation(del_id);
  }
  render() {
    const annotation = this.props.annotation;
    let jsxOut = [];
    Object.entries(annotation).forEach(([k,v]) => {  
      let annos = ''
      Object.entries(v).forEach(([xk,xv]) => 
      {
        Object.entries(xv).forEach(([xvk,xvv]) => 
          {
            console.log(xvv.token_literal)
            annos = annos + xvv.token_literal + ' '
          })
        jsxOut.push(<li key={k}><strong>{xk + ': '}</strong>
            {annos}
            <button id={k} onClick={(k) => this.clear_annotation(k)}>delete</button>
          </li>)
      })
    })
    return (
      <div className="annotations">
        {  
          jsxOut
        }
      </div>
    );
  }
}


class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButton: this.props.active_button,
      annotating:false,
    };
    this.buttonText = this.buttonText.bind(this);
  }

  triggerButton(e, btn) {
    if (this.props.active_button === null)
    {
      console.log(`this props active button ${this.props.active_button}`)
      this.props.buttonSelected(btn)
      e.target.textContent = "Click to Finish";
      this.setState({activeButton:btn})
    }
    else if (this.props.active_button !== btn)
    {
      //this.setState({activeButton:null})
      e.target.textContent = btn
    }
    else {
      e.target.textContent = btn
      this.props.buttonDeselected();
    }
  }
  buttonText(btn) {
    if (this.props.active_annotation_started() & this.props.active_button === btn)
    {
      console.log(`has annotating started? ${this.props.active_annotation_started()}`);
      //this.setState({annotating:true})
      return "Click to Submit";
    }
    else {
      //console.log(`has annotating started? ${this.props.active_annotation_started()}`);
      return btn;
    };
  }

  componentDidMount() {
    
  }
  render () {
    return (
      <div className="control-btn-group">
        <p style={{paddingLeft:"15px"}}>1. First pick a label:</p>
        <button className={this.props.active_button === 'religion' ? 'example_d':'example_c'} 
          onClick={(e) => this.triggerButton(e,'religion')}> {this.buttonText('religion')} </button>
        <button className={this.props.active_button === 'ideology' ? 'example_d':'example_c'} 
          onClick={(e) => this.triggerButton(e,'ideology')}> {this.buttonText('ideology')} </button>
        <button className={this.props.active_button === 'problem practice' ? 'example_d':'example_c'} 
          onClick={(e) => this.triggerButton(e,'problem practice')}> {this.buttonText('problem practice')} </button>
        <button className={this.props.active_button === 'victim' ? 'example_d':'example_c'} 
          onClick={(e) => this.triggerButton(e,'victim')}> {this.buttonText('victim')} </button>
        <button className={this.props.active_button === 'combatant group' ? 'example_d':'example_c'} 
          onClick={(e) => this.triggerButton(e,'combatant group')}> {this.buttonText('combatant group')} </button>
        <button className={this.props.active_button === 'other group' ? 'example_d':'example_c'} 
          onClick={(e) => this.triggerButton(e,'other group')}> {this.buttonText('other group')} </button>
      </div>
    );
  }
}

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

class Navigation extends React.Component {
  //serves primarily two functions. (1) render the observation data in the props
  // and (2) collect user annotations of the rendered observation
  constructor(props)
  {
    super(props);
    this.state = {
      annotations:{},
      annoation_id:null,
      active_annotation_class:null,
      active_annotation_started:false,
    }
    
  }
  
  addToBundle (token_position, token_literal, spanid) {
    
    var active_annotation_class = this.state.active_annotation_class;
    
    var annotation_id = this.state.annotation_id;
    var annotations = this.state.annotations;
    if (spanid) {annotation_id = spanid}
    if (active_annotation_class != null & annotation_id != null) {
      annotations[annotation_id][active_annotation_class].push({token_position:token_position, token_literal:token_literal}); 
      this.setState(() => {
        return {annotations:annotations, active_annotation_started:true}});
    }
    else if (active_annotation_class != null)
    {
      //active_annotation_class cannot be null if we are here
      var new_annotation_id = uuidv4();
      this.setState({active_annotation_started:true});
      if (spanid) 
      {
        new_annotation_id = spanid;
      }
      
      console.log(new_annotation_id);
      annotations[new_annotation_id] = {}
      annotations[new_annotation_id][active_annotation_class] = []
      annotations[new_annotation_id][active_annotation_class].push({token_position, token_literal});
      this.setState(() => {
        return {annotation_id:new_annotation_id, annotations:annotations}
      });
    }
    console.log(annotations); 
  }

  beginAnnotation (ner_category) {
    console.log(ner_category)
    const active_annotation_class = this.state.active_annotation_class;
    if (active_annotation_class !== null & active_annotation_class !== ner_category) {
      alert('please submit your annotaion before attempting to start a new one');
      this.setState({active_annotation_class:null})
      this.setState({active_annotation_class:active_annotation_class})
    }
    else {
      this.setState({active_annotation_class:ner_category});
    }
  }
  cancelAnnotation () {
    this.setState({active_annotation_class:null, annotation_id:null})
    
  }
  getNext () {
    let annotations = this.state.annotations
    this.props.onNextClick(annotations)
  }
  getPrevious() {
    this.props.onBackClick(); //TODO: finish this up
  }
  popAnnotation(del_id) {
    var active_annotation_class = this.state.active_annotation_class;
    if (active_annotation_class !== null) {
      alert('you must submit the annotation before deleting it!')
    }
    else {
      var annotations = this.state.annotations;
      console.log(`annotation for deletion: ${del_id}}`)
      delete annotations[del_id];
      this.setState({annotations:annotations});
    }
  }
  componentDidMount()
  {
    if (this.props.annotations) {
      const loaded_annotations = this.props.annotations;
      const anno_df = new DataFrame(loaded_annotations);
      //const grouped_df = anno_df.groupBy('spanid');
      let unique_spans = anno_df.unique('spanid').toArray();
      unique_spans.forEach(unique_span => {
        const grp = anno_df.where(rw => rw.get('spanid') == unique_span[0]);
        const sorted_group = grp.sortBy('tkid');
        let x = sorted_group.getRow(0);
        this.beginAnnotation(x.get('label_name'));
        let [rs, cs] = sorted_group.dim();
        for (var i = 0; i < rs; i++)
        {
          let curr_row = sorted_group.getRow(i);
          this.addToBundle(curr_row.get('tkid'), curr_row.get('token_text'), curr_row.get('spanid'));
        }
        this.cancelAnnotation()
      });
    }
  }

  render ()
  {
    const tokens_to_render = [];
    const input_tokens = this.props.tokens;
    //for production
    const submitLink = `https://www.mturk.com/mturk/externalSubmit?assignmentId=${this.props.assignmentId}`
    //const submitLink = `https://workersandbox.mturk.com/mturk/externalSubmit?assignmentId=${this.props.assignmentId}`
    //expect data to have sid, tkid, token_text
    var cntr = 0;
    input_tokens.forEach(tk => {
      tokens_to_render.push(
        <Token key={cntr} value={tk['token_text']} 
          index={tk['tkid']}
          onSelected={(ix,value) => this.addToBundle(ix, value)}
          clickable={this.state.active_annotation_class === null ? false : true} /> 
      )
      cntr = cntr + 1;
    });
    
      //render submit and back buttons
      if (this.props.rank_val !== this.props.hit_length)
      {
        return(
        <div className="grid-container">
          <div className="tracker">
            <JobTracker curr_rank={this.props.rank_val}
                            total_num={this.props.hit_length}
                            />
            <a className="video-link" href="https://vimeo.com/583033134/9f74b356cc" target="_blank" rel="noreferrer">
              <strong>Stop!</strong> If you haven't already, click here to learn how to use this app!
            </a>                
          </div>
          
          <Controls buttonSelected={(btn) => this.beginAnnotation(btn)} 
                    active_button={this.state.active_annotation_class}
                    buttonDeselected={() => this.cancelAnnotation()}
                    buttons={[]}
                    active_annotation_started={() => {
                      return (this.state.active_annotation_started);
                      }}/>{/*TODO this is fucked up. want to log the state variable before passing it to Control's props*/}
          <Annotation annotation={this.state.annotations} clear_annotation={(del_id) => this.popAnnotation(del_id)}/>
          <div className="ins">
            <Instructions />
          </div>
          <div className="control-box">
            <p>2. Then, in order, select the words that make up ONE phrase</p>
            {tokens_to_render}
          </div>
          
          <button onClick={() => this.getPrevious()}>Previous</button>
          <button onClick={() => this.getNext()}>Next Sentence</button>
          
        </div>
      );
    }
    else if (this.props.rank_val === this.props.hit_length)
    {
      return (
      <div className="grid-container">
        <div className="tracker">
          <JobTracker curr_rank={this.props.rank_val}
                          total_num={this.props.hit_length}
                          />
          <a href="https://vimeo.com/583033134/9f74b356cc" target="_blank" rel="noreferrer">
            Stop! If you haven't already, click here to learn how to use this app!
          </a>   
        </div>
        <Controls buttonSelected={(btn) => this.beginAnnotation(btn)} 
                    active_button={this.state.active_annotation_class}
                    buttonDeselected={() => this.cancelAnnotation()}
                    active_annotation_started={() => {
                      return (this.state.active_annotation_started);
                      }}/>
        <Annotation annotation={this.state.annotations} clear_annotation={(del_id) => this.popAnnotation(del_id)}/>
        <div className="control-box">
          <p>2. Then, in order, select the words that make up ONE phrase</p>
          {tokens_to_render}
        </div>
        <form action={submitLink} method="POST">
          <input id="assignmentId" name="assignmentId" type="hidden" value={this.props.assignmentId} />
          <input id="answer" name="answer" type="hidden" value="worker has completed all elements of this HIT" />
          <button onClick={() => this.getPrevious()}>Previous</button>
          <button onClick={() => this.getNext()} type="submit">Finish!</button>
        </form>
      </div>
      );
    }
    
  }
}

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
    const buttons_call = `${api_base_url}/${api_name}/getButtons`;
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
        }).then(fetch(buttons_call).then(res => res.json()).then(data => {
          console.log(data)
          this.setState({buttons_data:data})
        }))
        );
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
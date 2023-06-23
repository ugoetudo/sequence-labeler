import React from "react";
import Instructions from './instructions';
import DataFrame from 'dataframe-js';
import {v4 as uuidv4} from 'uuid';
import Annotation from './Annotation';
import Token from './Token';
import Controls from './Controls';
import JobTracker from './JobTracker';

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

        const grp = anno_df.where(rw => rw.get('spanid') === unique_span[0]);
        const sorted_group = grp.sortBy('tkid');
        let x = sorted_group.getRow(0);
        this.beginAnnotation(x.get('label_name'));
        // let [rs, cs] = sorted_group.dim();
        let rs = sorted_group.dim();

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
                    buttons={this.props.labels}
                    active_annotation_started={() => {
                      return (this.state.active_annotation_started);
                      }}/>
                      {/*TODO this is fucked up. want to log the state variable before passing it to Control's props*/}

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
                    buttons={this.props.labels}
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

export default Navigation;
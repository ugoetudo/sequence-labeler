import React from 'react';

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

export default Controls;
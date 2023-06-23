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

  triggerUR
  componentDidMount() {
    
  }



  render () {
    const buttons_collection = []
    var cntr = 0

    this.props.buttons.forEach(l => {
      
      buttons_collection.push(<button key={cntr} className={this.props.active_button === l['label_name'] ? 'example_d':'example_c'}
        onClick={(e) => this.triggerButton(e,l['label_name'])}> {this.buttonText(l['label_name'])}
      </button>)
      cntr++
    })
    return (
      
      <div className="control-btn-group">
        <p style={{paddingLeft:"15px"}}>1. First pick a label:</p>
        
        {
          buttons_collection.map(function(elem, index){
            return elem;
          })
        }
      </div>
    );
  }
}

export default Controls;
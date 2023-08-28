import React from 'react';

class Instructions extends React.Component {
    constructor(props){
        super(props);
        this.label_name_style = {'text-transform': 'uppercase'};
        this.label_definitions = [];
    }

    render() {
        if (this.props.label_definitions != null) {
            this.props.label_definitions.forEach( l => {
                this.label_definitions.push(
                    <li>
                        <p>
                            <strong style={this.label_name_style}>{l['label_name']}: </strong>{l['label_notes']} 
                        </p>
                    </li>
                )
            })
        }
        return (
        <div>
            <h2>Label Definitions</h2>
            <p>Select the sequence of words that represents:</p>
            <ul>
                {this.label_definitions}
            </ul>
        </div>
        );
    }
}

export default Instructions;
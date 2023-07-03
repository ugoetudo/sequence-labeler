import React from 'react';

class Instructions extends React.Component {
    label_name_style = {'text-transform': 'uppercase'};
    componentDidMount()
    {
        label_definitions = [];
        if (this.props.labels != null) {
            this.props.labels.forEach( l => {
                label_definitions.push(
                    <li>
                        <p>
                            <strong style={this.label_name_style}>{l['label_name']}: </strong>{l['label_notes']} 
                        </p>
                    </li>
                )
            })
        }
    }
    render() {
        return (
        <div>
            <h2>Label Definitions</h2>
            <p>Select the sequence of words that represents:</p>
            <ul>
                {label_definitions}
            </ul>
        </div>
        );
    }
}

export default Instructions;
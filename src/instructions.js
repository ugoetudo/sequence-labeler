import React from 'react'

class Instructions extends React.Component {
    render() {
        return (
        <div>
            <h2>Label Definitions</h2>
            <p>Select the sequence of words that represents:</p>
            <ul>
                <li>
                    <p>
                        <strong>RELIGION: </strong>the name of a religion 
                    </p>
                </li>
                <li>
                    <p>
                        <strong>IDEOLOGY: </strong>the name of an ideology 
                    </p>
                </li>
                <li>
                    <p>
                        <strong>PROBLEM PRACTICE: </strong>a description of a situation/behavior/pattern/practice that the speaker does not like 
                    </p>
                </li>
                <li>
                    <p>
                        <strong>VICTIM: </strong>anything that the speaker believes is under attack and in need of protection 
                    </p>
                </li>
                <li>
                    <p>
                        <strong>COMBATANT GROUP: </strong>the name or description of an armed group of any kind
                    </p>
                </li>
                <li>
                    <p>
                        <strong>OTHER GROUP: </strong>the name or description of a non-combatant group e.g. political party or a race of people
                    </p>
                </li>
            </ul>
        </div>
        );
    }
}

export default Instructions;
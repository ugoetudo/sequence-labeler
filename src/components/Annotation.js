import React from 'react';

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

export default Annotation;
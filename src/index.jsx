import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
// import {v4 as uuidv4} from 'uuid';
import HIT from './components/HIT';



ReactDOM.render(
  <Router>
    <div>
      <Route exact path='/entity_recog' component={HIT}/>
    </div>
  </Router>,
  document.getElementById('root')
);
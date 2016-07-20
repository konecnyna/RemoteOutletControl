import React, { Component } from 'react';
import styles from './base.css';
import {render} from 'react-dom';
import OutletList from './components/OutletList.jsx';
import HeaderCard from './components/HeaderCard.jsx';

export default class App extends Component {  
  render () {
    return (<div>
        <HeaderCard />            
        <OutletList />
      </div>
    );
  }
}

render(<App pollInterval={1000*60*15}/>, document.getElementById('app'));
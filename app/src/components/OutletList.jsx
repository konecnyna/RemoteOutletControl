import React, { Component } from 'react';
import Outlet from './Outlet.jsx';
import styles from '../base.css';


export default class OutletList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
    
    this.loadState();
  }consol

  loadState() {
    $.ajax({
      url: "/api/v1/state",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  }

  updateState(index, outlet, state) {      
    $.ajax({
      url: '/api/v1/updateJSON',
      dataType: 'json',
      cache: false,
      data: {
        type: outlet.type,
        outlet_number: outlet.outlet_number,
        state: state
      },
      success: function(data) { 
        this.setState({data: data});

      }.bind(this),
      error: function(xhr, status, err) {  
        this.setState({...this.state.data})        
        Materialize.toast('Something went wrong! Error: ' + err, 4000);        
      }.bind(this)
    });    
  }        


  render() {    
    return (
      <div>
        {this.state.data.map(function(outlet, i) {
          var boundClick = this.updateState.bind(this, i, outlet);
          
          return (
            <Outlet updateState={boundClick} 
              alias={outlet.alias} 
              is_loading={outlet.is_loading} 
              state={outlet.state} 
              outlet_number={i} 
              type={outlet.type}
              key={'item' + i}              
              /> 
          );
        }, this)}
      </div>
    );
  }
}
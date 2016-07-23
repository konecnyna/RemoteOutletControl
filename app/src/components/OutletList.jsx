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
  }



  loadState() {
    $.ajax({
      url: "/api/v1/state",
      dataType: 'json',
      cache: false,
      success: function(data) {
        data.map(function(outlet, i) {
          data[i].is_loading = false;  
        },this);
                  
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
        outlet_number: index,
        state: state
      },
      success: function(data) { 
        data.map(function(outlet, i) {
          data[i].is_loading = false;  
        },this);        
        this.setState({data: data});        
      }.bind(this),
      error: function(xhr, status, err) {
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
              key={'item' + i}              
              /> 
          );
        }, this)}
      </div>
    );
  }
}
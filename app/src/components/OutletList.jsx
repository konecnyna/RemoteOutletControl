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
        data = data.map( outlet => {
          outlet.is_loading = false;
          return outlet;          
        }) 
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  }

  updateState(index, outlet, state) {      
    var loadingData = this.state.data.slice(); 
    loadingData[index].is_loading = true;
    this.setState(loadingData);
    
    $.ajax({
      url: '/api/v1/updateJSON',
      dataType: 'json',
      cache: false,
      data: {
        type: outlet.type,
        outlet: outlet.key,
        state: state
      },
      success: function(data) {
        data = data.map((outlet, idx) => {          
          if (index === idx) {
            outlet.is_loading = false;            
          } else {
            outlet.is_loading = this.state.data[idx].is_loading;
          }
          return outlet;          
        }); 

        this.setState({data: data});        
      }.bind(this),
      error: function(xhr, status, err) { 
        var data = this.state.data.map((outlet, idx) => {          
          if (index === idx) {
            outlet.is_loading = false;            
          } else {
            outlet.is_loading = this.state.data[idx].is_loading;
          }
          return outlet;          
        }); 

        this.setState(data);
        Materialize.toast('Something went wrong! Error: ' + err, 4000);        
      }.bind(this)
    });    
  }        

  render() {    
    return (
      <div>
        {Object.keys(this.state.data).map(function(key, i) {
          var outlet = this.state.data[key];
          var boundClick = this.updateState.bind(this, i, outlet);
          
          return (
            <Outlet updateState={boundClick} 
              is_loading={outlet.is_loading}               
              {...outlet}
              /> 
          );
        }, this)}
      </div>
    );
  }
}
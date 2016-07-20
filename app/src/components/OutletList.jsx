import React, { Component } from 'react';
import Outlet from './Outlet.jsx';
import styles from '../base.css';


export default class OutletList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }    
  }

  loadState() {
    $.ajax({
      url: "/state",
      dataType: 'json',
      cache: false,
      success: function(data) {
        data.map(function(outlet, i) {
          data[i].is_loading = false;  
        },this);
      
        
        console.log("loaded state");
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  }

  updateState(index, outlet, state) {
    this.state.data[index].is_loading = true;
  
    $.ajax({
      url: '/updateJSON',
      dataType: 'json',
      cache: false,
      data: {
        outlet_number: index,
        state: state
      },
      success: function(data) { 
        data[index].state = state;
        this.setState({data: data});                        
      }.bind(this),
      error: function(xhr, status, err) {
        Materialize.toast('Something went wrong! Error: ' + err, 4000);
        this.state.data[index].is_loading = false;        
      }.bind(this)
    });    
  }

  componentDidMount() {
    this.loadState();
    setInterval(this.loadState, 1000*30);      
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
              outlet_number={outlet.outlet_number} 
              key={'item' + i}              
              /> 
          );
        }, this)}
      </div>
    );
  }
}
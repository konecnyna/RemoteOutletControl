import React, { Component } from 'react';
// /import BulbImg from './bulb.png';


export default class Outlet extends Component{  
  outletRequest(outlet_state) {    
    this.props.updateState(outlet_state);      
  }

  render() {
    return (
      <div className='card blue-grey darken-1 state-card-off'>
        <div className={parseInt(this.props.state) === 0 ? 'card-content state-card-off' : 'card-content  state-card-on'}>
          <span className="card-title">
            <div className="card-title-with-img">            
                {this.props.alias}                     
            <img src="asd" height="32px" className={parseInt(this.props.state) === 0 ? 'hidden' : 'float-right-side'}/>
            </div>
          </span>                    
        </div>
        <div className={parseInt(this.props.state) === 1 && !this.props.is_loading ? "card-action state-card-on" : "card-action state-card-off"}>
          {this.props.is_loading ?
            <div className="progress">
              <div className="indeterminate yellow-spinner"></div>
            </div>
            : 
            <div>
              <a data="1" onClick={this.outletRequest.bind(this, "1")}>On</a>
              <a data="0" onClick={this.outletRequest.bind(this, "0")}>Off</a>
            </div>
          }                  
        </div>
      </div>        
    );
  }
}
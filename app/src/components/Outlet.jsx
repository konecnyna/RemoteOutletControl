import React, { Component } from 'react';
var imgSrc = './bulb.png';

export default class Outlet extends Component {  
  constructor(props) {
    super(props);    
    this.state = {is_loading: false};
    console.log(imgSrc, "construct");    
  }

  componentWillReceiveProps(nextProps) {
    this.setState({is_loading: false});
  }

  outletRequest(outlet_state) {
    this.setState({is_loading: true});
    this.props.updateState(outlet_state);
  }  

  render() {    
    
    return (
      <div className='card blue-grey darken-1 state-card-off'>
        <div className={parseInt(this.props.state) === 0 ? 'card-content state-card-off' : 'card-content  state-card-on'}>
          <span className="card-title">
            <div className="card-title-with-img">            
                {this.props.alias}                     
            <img src={require('./bulb.png')} height="32px" className={parseInt(this.props.state) === 0 ? 'hidden' : 'float-right-side'}/>
            </div>
          </span>                    
        </div>
        <div className={parseInt(this.props.state) === 1 && !this.props.is_loading ? "card-action state-card-on" : "card-action state-card-off"}>
          {this.state.is_loading ?
            <div className="progress">
            asdkasdkas
              <div className="indeterminate yellow-spinner"></div>
            </div>
            : 
            <div className="toggle-buttons">            
              <a data="1" onClick={this.outletRequest.bind(this, "1")} className="on-button">On</a>
              <a data="0" onClick={this.outletRequest.bind(this, "0")} className="off-button">Off</a>              
            </div>
          }                  
        </div>
      </div>        
    );
  }
}
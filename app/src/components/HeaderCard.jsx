import React, { Component } from 'react';
//https://www.codementor.io/reactjs/tutorial/beginner-guide-setup-reactjs-environment-npm-babel-6-webpack
export default class HeaderCard extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      summary: "Loading",
      hourly_summary: "Loading",
      temperature: "Loading",      
    };
  }

  loadWeather() {
    $.ajax({
      url: '/api/v1/weather',
      dataType: 'json',
      cache: false,
      success: function(data) {        
        this.setState({
          summary: data.currently.summary,
          hourly_summary: data.hourly.summary,
          temperature: data.currently.temperature,          
        });
        
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });

  }

  componentDidMount = function() {          
    this.loadWeather();      
    setInterval(this.loadWeather, 1000*60*10);  
  }
 
  render() {  
    return(
        <div className="card">
            <div className="card-image">
              <img src={'http://cam.sheratontribecaview.com/sheraton-tribeca-new-york-hotel.jpg?' + (new Date()).getTime()} />
              <span className="card-title">                
              </span>              
            </div>
            <div className="card-content">
              <div className="col s12 m6">
                <h3>Currently - {this.state.summary}.</h3>                
                <h5>
                  Outside: {this.state.temperature}°. Today, {this.state.hourly_summary}
                  <br/>
                </h5>
              </div>
            </div>
            <div className="card-action">
              <a href="http://forecast.io/">More Info</a>
            </div>
        </div>
      );
  }
}
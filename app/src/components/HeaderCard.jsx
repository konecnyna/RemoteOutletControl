import React, { Component } from 'react';
//https://www.codementor.io/reactjs/tutorial/beginner-guide-setup-reactjs-environment-npm-babel-6-webpack
export default class HeaderCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summary: "Loading",
      hourly_summary: "Loading",
      temperature: "Loading",
      home_weather: {
        temperature: "Loading",
        humidity: "Loading",
        lux: "Loading",
      }
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


  loadHomeWeather() {
    $.ajax({
      url: 'https://project-3654207232474154346.firebaseio.com/weather.json?limitToLast=1&orderBy="$key"',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({
          home_weather: data[Object.keys(data).sort().pop()],
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

    this.loadHomeWeather();
  }

  render() {
    var imgUrl = "http://cam.sheratontribecaview.com/sheraton-tribeca-new-york-hotel.jpg?" + (new Date()).getTime();
    var headerImageBackground = {
      backgroundImage: 'url(' + imgUrl + ')'
    };

    return(
        <div className="card">
            <div className="card-image card-image-height">
              <div className="center-cropped" style={headerImageBackground}>
              </div>

              <span className="card-title">
              </span>
            </div>
            <div className="card-content">
              <div className="col s12 m6">
                <h3>Outside - {this.state.summary}.</h3>
                <h5>
                  <div className="row">
                      <div className="col s12">
                        Outside: {this.state.temperature}°. Today, {this.state.hourly_summary}
                      </div>
                  </div>
                </h5>

                <h3>Inside:</h3>

                <div className="row">
                  <h5>
                    <div className="col s12 m4">
                      Temperature: {this.state.home_weather.temperature}°
                    </div>
                    <div className="col s12 m4">
                      Humidity: {this.state.home_weather.humidity}%
                    </div>
                    <div className="col s12 m4">
                      Light Level: {this.state.home_weather.lux}
                    </div>
                  </h5>
                </div>




              </div>
            </div>
            <div className="card-action">
              <a href="http://forecast.io/">More Info</a>
            </div>
        </div>
      );
  }
}

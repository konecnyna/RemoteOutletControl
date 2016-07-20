import React from 'react';
import {render} from 'react-dom';
import OutletList from './components/OutletList.jsx';

//https://www.codementor.io/reactjs/tutorial/beginner-guide-setup-reactjs-environment-npm-babel-6-webpack

var HeaderCard = React.createClass({
  render: function() {  
    return(
        <div className="card">
            <div className="card-image">
              <img src={'https://images.webcamgalore.com/5943-current-webcam-New-York-City-New-York.jpg?' + (new Date()).getTime()} />
              <span className="card-title">                
              </span>              
            </div>
            <div className="card-content">
              <div className="col s12 m6">
                <h3>Currently - NaN. Today, NaN</h3>
                
                <h5>
                  Outside: NaN° |
                  Inside: NaN° |
                  Lux: NaN<br/>
                </h5>
              </div>
            </div>
            <div className="card-action">
              <a href="http://forecast.io/">More Info</a>
            </div>
        </div>
      );
  }
});



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otherChecked: false,
    };
  }


  loadState() {
    $.ajax({
      url: "/state",
      dataType: 'json',
      cache: false,
      success: function(data) {
        {data.map(function(outlet, i) {
          data[i].is_loading = false;  
        },this);}
        
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  }

  updateState(index, outlet, state) {
    this.state.data[index].is_loading = true;
    this.setState({data: this.state.data});

    $.ajax({
      url: '/updateJSON',
      dataType: 'json',
      cache: false,
      data: {
        outlet_number: outlet.outlet_number,
        state: state
      },
      success: function(data) {      
        data[index].state = state;
        this.setState({data: data});                
      }.bind(this),
      error: function(xhr, status, err) {
        Materialize.toast('Something went wrong! Error: ' + err, 4000);
        this.state.data[index].is_loading = false;
        this.setState({data: this.state.data});
      }.bind(this)
    });    
  }

  loadWeather() {
    $.ajax({
      url: '/weather',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({weather: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });

  }

  loadHomeWeather() {
    $.ajax({
      url: 'http://192.168.1.133/weather', //https://project-3654207232474154346.firebaseio.com/weather.json
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({home_weather: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });


    
    ref.child("weather").limitToLast(1).on("value", function(snapshot) {
       var dataVal = snapshot.val();
       var keys = Object.keys(dataVal);       
    });        
  }

  componentDidMount() {
    //this.loadState();
    console.log("booasdsbs");
    //setInterval(this.loadState, 1000*30);
    //this.loadWeather();
    //setInterval(this.loadWeather, this.props.pollInterval);  
    //this.loadHomeWeather();    
    //setInterval(this.loadHomeWeather, this.props.pollInterval);  
  }

  render () {
    return <div>
    	<HeaderCard weather={this.state.weather} home_weather={this.state.home_weather} />
    	<h1>Double boobs</h1>
    </div>;
  }
}

render(<App/>, document.getElementById('app'));
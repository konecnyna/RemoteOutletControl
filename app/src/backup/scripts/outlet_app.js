var OutletApp = React.createClass({
  getInitialState: function() {
    return {
      data: [
        {is_loading: false}
      ],
      weather: {
        currently: {
          temperature: '',
          summary: ''
        },
        hourly: {},
      },
      home_weather: {
        temperature: '',
      }
    };
  },

  loadState: function() {
    console.log(this.props);
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
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  updateState: function(index, outlet, state) {
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
  },

  loadWeather: function() {
    $.ajax({
      url: '/weather',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({weather: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  loadHomeWeather: function() {
    $.ajax({
      url: 'http://192.168.1.133/weather', //https://project-3654207232474154346.firebaseio.com/weather.json
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({home_weather: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });


    
    ref.child("weather").limitToLast(1).on("value", function(snapshot) {
       var dataVal = snapshot.val();
       var keys = Object.keys(dataVal);       
    });        
  },
  

  componentDidMount: function() {
    this.loadState();
    setInterval(this.loadState, 1000*30);
    this.loadWeather();
    setInterval(this.loadWeather, this.props.pollInterval);  
    this.loadHomeWeather();    
    setInterval(this.loadHomeWeather, this.props.pollInterval);  
  },

  render: function() {
    return (
      <div className="container">
        <HeaderCard weather={this.state.weather} home_weather={this.state.home_weather} />
        <OutletList data={this.state.data} updateState={this.updateState}/>
        <ModalCard data={this.state.data} />      
      </div>
    );
  }
});


/////////////////////////
//  Outlet Components.
/////////////////////////

var OutletList = React.createClass({
  render: function() {    
    return (
      <div>
        {this.props.data.map(function(outlet, i) {
          var boundClick = this.props.updateState.bind(null, i, outlet);                  
          return (
            <Outlet updateState={boundClick} alias={outlet.alias} is_loading={outlet.is_loading} state={outlet.state} outlet_number={outlet.outlet_number} ref={'item' + i} /> 
          );
        }, this)}
      </div>
    );
  }
});

var Outlet = React.createClass({
  outletRequest: function(state) {    
    this.props.updateState(state);      
  },

  render: function() {
    return (
      <div className='card blue-grey darken-1 state-card-off'>
        <div className={parseInt(this.props.state) === 0 ? 'card-content state-card-off' : 'card-content  state-card-on'}>
          <span className="card-title">
            <div className="card-title-with-img">            
                {this.props.alias}                     
                <img src="bulb.png" height="32px" className={parseInt(this.props.state) === 0 ? 'hidden' : 'float-right-side'}/>
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
});

/////////////////////////
//  Header Card.
/////////////////////////

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
                <h3>Currently - {this.props.weather.currently.summary}. Today, {this.props.weather.hourly.summary}</h3>
                
                <h5>
                  Outside: {this.props.weather.currently.temperature}° |
                  Inside: {this.props.home_weather.temperature}° |
                  Lux: {this.props.home_weather.light_level}<br/>
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


var ModalCard = React.createClass({
  setupTrigger: function() {
    self = this;
    $('.modal-trigger').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
        ready: function() {}, // Callback for Modal open
        complete: function() {                
          $.ajax({
              url: '/api/v1/update_outlets',
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({outlets: JSON.parse(self.state.textAreaValue)}),
              dataType: 'json'
          });
          
        }        
     });
  },

  getInitialState: function() { 
    return {
      textAreaValue: ""
    };
  },

    componentWillReceiveProps: function(nextProps) {
    var prettyJSON = JSON.stringify(this.props.data, null, 4);
    this.setState({
      textAreaValue: prettyJSON
    });
  },

  handleChange:function(e){
    this.setState({textAreaValue:e.target.value});    
  },

  componentDidMount: function() {
    this.setupTrigger();
  },

  render: function() {
    return(
      <div className="edit-modal center">
        <a className="waves-effect waves-light btn modal-trigger" href="#modal1">Edit outlets</a>          
        <div id="modal1" className="modal bottom-sheet">
          <div className="modal-content">
            <h4>Edit:</h4>
            <textarea id="json-picks" 
              value={this.state.textAreaValue}
              onChange={this.handleChange}></textarea>  
          </div>
          <div className="modal-footer">
            <a href="#!" className=" modal-action modal-close waves-effect waves btn-flat">Submit</a>
          </div>
        </div>

      </div>
    );
  }



});


ReactDOM.render(
  <div>
    <OutletApp url="/state" pollInterval={1000*60*15}/>    
  </div>
  ,
  document.getElementById('content')
);

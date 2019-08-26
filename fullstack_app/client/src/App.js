
// /client/App.js
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import WelcomeMenu from './components/WelcomeMenu';
import SignIn from './components/SignIn';

class App extends Component {
  // initialize our state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    form: "Menu",
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (message) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message,
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply },
    });
  };

  changeForm(name)
  {
    this.setState({form: name});
  }

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    var currentWelcome;
    if(this.state.form === "Menu")
      {
        currentWelcome=
        <div>
          <div>
              <button onClick={() => this.changeForm("SignIn")} class="button">
                  Sign In
              </button>
          </div>
          <div>
              <button class="button">
                  Sign Up
              </button>
          </div>
        </div>;
      }
    else if(this.state.form === "SignIn")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label class="inputDescriber" for="userName">Username</label>
              <input class="inputBox" type="text" placeholder="Enter Username" name="userName" required/>
            </div>
            <div>
              <label class="inputDescriber" for="password">Password</label>
              <input class="inputBox" type="password" placeholder="Enter Password" name="password" required/>
            </div>
            <div>
              <div class="optionalForget">
                <label>
                  <input type="checkbox" name="remember"/> Remember Me
                </label>
              </div>
              <div>
                <button class="smallButton" type="submit">Sign In</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button class="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
            <div class="optionalForget">
              <span>Forgot <a href="https://www.google.com/search?q=how+to+remember+your+password&oq=how+to+remember+your+password&aqs=chrome.0.0l6.4376j1j8&sourceid=chrome&ie=UTF-8" target="_blank">password?</a></span>
            </div>
          </div>
        </div>;
      }
    const { data } = this.state;
    document.body.style = 'background: #38414a';
    return (
      <div class="container">
        <div class="header">
          Welcome!
        </div>
        {currentWelcome}
      </div>
    );
  }
}

export default App;
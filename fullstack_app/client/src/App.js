
// /client/App.js
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

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
    username: "",
    password: "",
    validation: "",
    usernamepointer: null,
    passwordpointer: null,
    validationpointer: null,
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  /*componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }*/

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

  changeForm(name)
  {
    this.setState({form: name,});
  }

  usernameChange = event =>
  {
    this.setState({username: event.target.value,});
    this.setState({usernamepointer: event.target,});
  }

  passwordChange = event =>
  {
    this.setState({password: event.target.value,});
    this.setState({passwordpointer: event.target,});
  }

  confirmationChange = event =>
  {
    this.setState({validation: event.target.value,});
    this.setState({validationpointer: event.target,});
  }

  infoCheck()
  {
    var username = this.state.username.trim();
    var password = this.state.password.trim();
    var validation = this.state.validation.trim();
    if(username.length<4)
    {
      this.setState({form: "SignUpShortUsername"});
      this.clearSignInUpFields();
    }
    else if(password.length<4)
    {
      if(validation.length<4)
      {
        this.setState({form: "SignUpShortPassAndValid"});
        this.clearSignInUpFields();
      }
      else
      {
      this.setState({form: "SignUpShortPassword"});
      this.clearSignInUpFields();
      }
    }
    else if(validation.length<4)
    {
      this.setState({form: "SignUpShortValidation"});
      this.clearSignInUpFields();
    }
    else if(password !== validation)
    {
      this.setState({form: "SignUpNoPassValidMatch"});
      this.clearSignInUpFields();
    }
    else
    {
      this.signup(username, password);
    }
  }

  signin(username, password)
  {
    var serverResponse;

    axios.post('http://localhost:3000/signin', {username: username, password: password})
    .then((response)=> {
      serverResponse = response.data;

      if(serverResponse === "No User")
      {
        this.clearSignInUpFields();
        this.setState({form: "SignInNoUser"});
      }
      else if(serverResponse === "Wrong Password")
      {
        this.clearSignInUpFields();
        this.setState({form: "SignInWrongPassword"});
      }
      else if(serverResponse === "Sign In")
      {
        this.clearSignInUpFields();
        this.setState({form: "HomePage"});
      }
    });
  }

  signup(username, password)
  {
    var serverResponse;

    axios.post('http://localhost:3000/signup', {username: username, password: password})
    .then((response)=> {
      serverResponse = response.data;

      if(serverResponse === "User Exists")
      {
        this.setState({form: "SignUpUserExists"});
        this.clearSignInUpFields();
      }
      else if(serverResponse === "User Created")
      {
        this.setState({form: "SignUpUserCreated"});
        this.clearSignInUpFields();
      }
    });
  }

  clearSignInUpFields()
  {
    var userpointer = this.state.usernamepointer;
    var passpointer = this.state.passwordpointer;
    var validpointer = this.state.validationpointer;
    if(userpointer !== null)
    {
    userpointer.value = "";
    }
    if(passpointer !== null)
    {
    passpointer.value = "";
    }
    if(validpointer !== null)
    {
    validpointer.value = "";
    }
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
              <button onClick={() => this.changeForm("SignIn")} className="button">
                  Sign In
              </button>
          </div>
          <div>
              <button onClick={() => this.changeForm("SignUp")} className="button">
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
            <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
            <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Enter Password" onChange={this.passwordChange} required/>
            </div>
            <div>
              <div className="optionalForget">
                <label>
                  <input type="checkbox"/> Remember Me
                </label>
              </div>
              <div>
                <button className="smallButton" type="submit" onClick={() => this.signin(this.state.username, this.state.password)}>Sign In</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button className="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
            <div className="optionalForget">
              <span>Forgot <a href="http://letmegooglethat.com/?q=how+to+remember+your+password" target="_blank" rel="noopener noreferrer">password?</a></span>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "SignInNoUser")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label className="errorMessage">That User Doesn't Exist!</label>
            </div>
            <div>
            <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input className="badInput" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
            <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Enter Password" onChange={this.passwordChange} required/>
            </div>
            <div>
              <div className="optionalForget">
                <label>
                  <input type="checkbox"/> Remember Me
                </label>
              </div>
              <div>
                <button className="smallButton" type="submit" onClick={() => this.signin(this.state.username, this.state.password)}>Sign In</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button className="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
            <div className="optionalForget">
              <span>Forgot <a href="http://letmegooglethat.com/?q=how+to+remember+your+password" target="_blank" rel="noopener noreferrer">password?</a></span>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "SignInWrongPassword")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label className="errorMessage">Incorrect Password. Try Again.</label>
            </div>
            <div>
            <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
            <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="badInput" type="password" placeholder="Enter Password" onChange={this.passwordChange} required/>
            </div>
            <div>
              <div className="optionalForget">
                <label>
                  <input type="checkbox"/> Remember Me
                </label>
              </div>
              <div>
                <button className="smallButton" type="submit" onClick={() => this.signin(this.state.username, this.state.password)}>Sign In</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button className="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
            <div className="optionalForget">
              <span>Forgot <a href="http://letmegooglethat.com/?q=how+to+remember+your+password" target="_blank" rel="noopener noreferrer">password?</a></span>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "SignUp")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Enter Password" onChange={this.passwordChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Confirm Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Confirm Password" onChange={this.confirmationChange} required/>
            </div>
            <div>
              <div>
                <button className="smallButton" type="submit" onClick={() => this.infoCheck()}>Sign Up</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button className="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "SignUpShortUsername")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label className="errorMessage">Ensure username and password are four characters or longer.</label>
            </div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input className="badInput" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Enter Password" onChange={this.passwordChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Confirm Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Confirm Password" onChange={this.confirmationChange} required/>
            </div>
            <div>
              <div>
                <button className="smallButton" type="submit" onClick={() => this.infoCheck()}>Sign Up</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button className="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "SignUpShortPassword")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label className="errorMessage">Ensure username and password are four characters or longer.</label>
            </div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="badInput" type="password" placeholder="Enter Password" onChange={this.passwordChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Confirm Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Confirm Password" onChange={this.confirmationChange} required/>
            </div>
            <div>
              <div>
                <button className="smallButton" type="submit" onClick={() => this.infoCheck()}>Sign Up</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button className="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "SignUpShortPassAndValid")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="badInput" type="password" placeholder="Enter Password" onChange={this.passwordChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Confirm Password</label>
            </div>
            <div>
              <input className="badInput" type="password" placeholder="Confirm Password" onChange={this.confirmationChange} required/>
            </div>
            <div>
              <div>
                <button className="smallButton" type="submit" onClick={() => this.infoCheck()}>Sign Up</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button className="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "SignUpShortValidation")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label className="errorMessage">Ensure username and password are four characters or longer.</label>
            </div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Enter Password" onChange={this.passwordChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Confirm Password</label>
            </div>
            <div>
              <input className="badInput" type="password" placeholder="Confirm Password" onChange={this.confirmationChange} required/>
            </div>
            <div>
              <div>
                <button className="smallButton" type="submit" onClick={() => this.infoCheck()}>Sign Up</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button className="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "SignUpNoPassValidMatch")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label className="errorMessage">Passwords don't match</label>
            </div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="badInput" type="password" placeholder="Enter Password" onChange={this.passwordChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Confirm Password</label>
            </div>
            <div>
              <input className="badInput" type="password" placeholder="Confirm Password" onChange={this.confirmationChange} required/>
            </div>
            <div>
              <div>
                <button className="smallButton" type="submit" onClick={() => this.infoCheck()}>Sign Up</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button className="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "SignUpUserExists")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label className="errorMessage">That username already exists!</label>
            </div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input className="badInput" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Enter Password" onChange={this.passwordChange} required/>
            </div>
            <div>
              <label className="inputDescriber">Confirm Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Confirm Password" onChange={this.confirmationChange} required/>
            </div>
            <div>
              <div>
                <button className="smallButton" type="submit" onClick={() => this.infoCheck()}>Sign Up</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <button className="smallButton" onClick={() => this.changeForm("Menu")}>Cancel</button>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "SignUpUserCreated")
      {
        currentWelcome= 
        <div>
          <div>
            <div>
              <label className="signupSuccess">Account Successfully Created!</label>
            </div>
            <div>
              <button className="button" onClick={() => this.changeForm("SignIn")}>Sign In</button>
            </div>
          </div>
        </div>;
      }
      else if(this.state.form === "HomePage")
      {
        currentWelcome=
        <div>
          <h1>Welcome, {this.state.username}</h1>
        </div>
      }
    const { data } = this.state;
    document.body.style = 'background: #38414a';
    return (
      <div className="container">
        <div className="header">
          Welcome!
        </div>
        {currentWelcome}
      </div>
    );
  }
}

export default App;
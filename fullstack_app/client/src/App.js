
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
    header: "Welcome",
    username: "",
    password: "",
    validation: "",
    usernamepointer: null,
    passwordpointer: null,
    validationpointer: null,
  };

  changeForm(name)
  {
    this.setState({form: name,});
  }

  usernameChange = event =>
  {
    this.setState({username: event.target.value, usernamepointer: event.target});
  }

  passwordChange = event =>
  {
    this.setState({password: event.target.value, passwordpointer: event.target});
  }

  confirmationChange = event =>
  {
    this.setState({validation: event.target.value, validationpointer: event.target});
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
        this.setState({header: "InApp"})
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

  signupEnter = (e) => {
    if(e.key === 'Enter') {
      this.infoCheck();
    }
  }

  signinEnter = (e) =>
  {
    if(e.key === 'Enter') {
      this.signin(this.state.username, this.state.password);
    }
  }

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    var currentPageContent;
    var currentHeader;

    if(this.state.form === "Menu")
      {
        currentPageContent=
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
        currentPageContent= 
        <div>
          <div>
            <div>
            <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input autoFocus className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
            <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Enter Password" onKeyDown={this.signinEnter} onChange={this.passwordChange} required/>
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
        currentPageContent= 
        <div>
          <div>
            <div>
              <label className="errorMessage">That User Doesn't Exist!</label>
            </div>
            <div>
            <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input autoFocus className="badInput" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
            <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="inputBox" type="password" placeholder="Enter Password" onKeyDown={this.signinEnter} onChange={this.passwordChange} required/>
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
        currentPageContent= 
        <div>
          <div>
            <div>
              <label className="errorMessage">Incorrect Password. Try Again.</label>
            </div>
            <div>
            <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input autoFocus className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
            </div>
            <div>
            <label className="inputDescriber">Password</label>
            </div>
            <div>
              <input className="badInput" type="password" placeholder="Enter Password" onKeyDown={this.signinEnter} onChange={this.passwordChange} required/>
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
        currentPageContent= 
        <div>
          <div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input autoFocus className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
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
              <input className="inputBox" type="password" placeholder="Confirm Password" onKeyDown={this.signupEnter} onChange={this.confirmationChange} required/>
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
        currentPageContent= 
        <div>
          <div>
            <div>
              <label className="errorMessage">Ensure username and password are four characters or longer.</label>
            </div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input autoFocus className="badInput" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
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
              <input className="inputBox" type="password" placeholder="Confirm Password" onKeyDown={this.signupEnter} onChange={this.confirmationChange} required/>
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
        currentPageContent= 
        <div>
          <div>
            <div>
              <label className="errorMessage">Ensure username and password are four characters or longer.</label>
            </div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input autoFocus className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
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
              <input className="inputBox" type="password" placeholder="Confirm Password" onKeyDown={this.signupEnter} onChange={this.confirmationChange} required/>
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
        currentPageContent= 
        <div>
          <div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input autoFocus className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
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
              <input className="badInput" type="password" placeholder="Confirm Password" onKeyDown={this.signupEnter} onChange={this.confirmationChange} required/>
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
        currentPageContent= 
        <div>
          <div>
            <div>
              <label className="errorMessage">Ensure username and password are four characters or longer.</label>
            </div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input autoFocus className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
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
              <input className="badInput" type="password" placeholder="Confirm Password" onKeyDown={this.signupEnter} onChange={this.confirmationChange} required/>
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
        currentPageContent= 
        <div>
          <div>
            <div>
              <label className="errorMessage">Passwords don't match</label>
            </div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input autoFocus className="inputBox" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
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
              <input className="badInput" type="password" placeholder="Confirm Password" onKeyDown={this.signupEnter} onChange={this.confirmationChange} required/>
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
        currentPageContent= 
        <div>
          <div>
            <div>
              <label className="errorMessage">That username already exists!</label>
            </div>
            <div>
              <label className="inputDescriber">Username</label>
            </div>
            <div>
              <input autoFocus className="badInput" type="text" placeholder="Enter Username" onChange={this.usernameChange} required/>
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
              <input className="inputBox" type="password" placeholder="Confirm Password" onKeyDown={this.signupEnter} onChange={this.confirmationChange} required/>
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
        currentPageContent= 
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
        currentPageContent=
        <div>
          <h1>Welcome, {this.state.username}</h1>
        </div>
      }

      if(this.state.header === "Welcome")
      {
        currentHeader=
        <div>
          <div className="header">
            Welcome!
          </div>
        </div>;
      }
      else if(this.state.header === "InApp")
      {
        currentHeader=
        <div className="navigationBar">
          <div>
            <ul>
              <li>Home</li>
              <li>Browse Mods</li>
              <li>Mod Builds</li>
              <li>Profile</li>
              <li>Help</li>
              <li>Forum</li>
            </ul>
          </div>
        </div>
      }
    document.body.style = 'background: #38414a';
    return (
      <div>
        <div className="container">
          {currentHeader}
        </div>
        <div className="container">
          {currentPageContent}
        </div>
      </div>
    );
  }
}

export default App;
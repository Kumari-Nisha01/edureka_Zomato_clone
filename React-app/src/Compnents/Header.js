import React from 'react';
import '../Styles/header.css';
import Modal from 'react-modal';
import GoogleLogin  from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import queryString from 'query-string';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '29%',
      padding: '40px',
      background: 'white',
      transform: 'translate(-50%, -50%)'
    }
  };
  const cstomStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      background: 'white',
      color: '#192f60',
      transform: 'translate(-50%, -50%)'
    }
  };

  const cstmStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        background: 'white',
        color: '#192f60',
        transform: 'translate(-50%, -50%)'
      }
  }

  const cssclass = {
    content: {
        padding: '10px 45px 10px 0px',
        fontWeight: '500',
        color: 'blue'
    }
  }

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            userName: undefined,
            isLoggedIn: false,
            userCredentialIsOpen: false,
            userModalIsOpen: false,
            users: [],
            gender: undefined,
            firstname: undefined,
            lastname: undefined,
            mobile: undefined,
            email: undefined,
            loginData: [],
            password: undefined
        }
    }
    componentDidMount(){
        const qs= queryString.parse(this.props.users);
        const email = qs.users;

        axios({
            method: 'GET',
            url: `http://localhost:2024/login/${email}`,
            headers: { 'Content-Type': 'application/json'}
          }).then(response => {
            this.setState({users: response.data.users, email })
          }).catch(err => console.log(err))
    }

    handleUserDetails= (event) => {
        const name= event.target.name;
        this.setState({...this.state, [name] : event.target.value})
    }
    handleUserLogin= (event) => {
        const name= event.target.name;
        this.setState({...this.state, [name] : event.target.value})
    }


    handleLoginDetail= () => {
        const { email, password, loginData, username, firstname } = this.state;

        if (email.indexOf(email) == 1) {
            email.push(email);
        } else {
            const index = email.indexOf(email);
            
        }

        const inputObject= {
            password: password,
            email: email,
            username: username
        };
        console.log(inputObject);
        axios({
            method: 'GET',
            url: `http://localhost:2024/user/${email}`,
            header: { 'Content-Type': 'application/json'},
            data: inputObject
        })
        .then(response => {
            console.log(response)
           
            this.setState({ 
            users: response.name, email: email, password: password });
        alert("Logged In");
        this.setState({userCredentialIsOpen : false, loginModalIsOpen : false, username: firstname, isLoggedIn: true })
    })
        .catch((err) => {
                     console.log(err);
                 });
                 if (loginData.length !== 0) {
                         if (loginData.email === email && loginData.password === password) {
                             this.setState ({ username: firstname, isLoggedIn: true, userCredentialIsOpen: false });
                         }
                             else {
                                 alert('Invalid Input, Please check');
                             }
                         }
                         localStorage.setItem( 'username', firstname );
            }


    responseUserCred = (response) => {
        this.setState ({ userName: response.data, isLoggedIn: true, userCredentialIsOpen : false })
    }

    handleCreateAccount = () => {
        const {gender, firstname, loginData, lastname, username, mobile, email, password} = this.state

        const inputObject= {
            gender: gender,
            firstname: firstname,
            lastname: lastname,
            mobile: mobile,
            email: email,
            username: username,
            password: password
        };
        console.log(inputObject);
        axios({
            method: 'POST',
            url: 'http://localhost:2024/adduser',
            header: { 'Content-Type': 'application/json'},
            data: inputObject
        })
        .then(response => {this.setState({ 
            users: response.data.users, gender: gender, firstname: firstname, lastname: lastname, mobile: mobile, email: email, password: password 
        });
        alert("User created successfully, Login to continue");
        this.setState({userModalIsOpen : false, username: firstname, isLoggedIn: true });

    })
        .catch()

    }

    handleAccnt = () => {
        this.setState({ userModalIsOpen: true})
    }


    handleLogin = () => {
        this.setState ({ loginModalIsOpen: true })
    }
    handleClose = () => {
        this.setState ({ loginModalIsOpen: false })
    }

    handleRemove = () => {
        this.setState ({ userModalIsOpen: false })
    }

    handleCredClose = () => {
        this.setState ({ userCredentialIsOpen: false })
    }

    responseGoogle = (response) => {
       this.setState ({ userName: response.profileObj.name, isLoggedIn: true, loginModalIsOpen: false })
    }

    responseFacebook = (response) => {
        this.setState ({ userName: response.name, isLoggedIn: true, loginModalIsOpen: false })
    }

    handleLogout = () => {
        this.setState ({ isLoggedIn: false, userName: undefined })
        alert("Are you sure !! Want to LogOut");
    }

    handleCredential = () => {
            this.setState ({ userCredentialIsOpen: true })
    }

    render() {
        const {loginModalIsOpen, userModalIsOpen, isLoggedIn, userCredentialIsOpen, userName } = this.state;
        return(
                <div className= "app-header">
                    { isLoggedIn ? <div>
                         <div className="Login0">{ userName }</div>
                         <span onClick={() => { alert.show('Are You sure want to, LOGOUT!')}}></span>
                             <div className="logout" style= {{ width: '95px' }} onClick= {this.handleLogout}>Logout</div> 
                            </div> : <div>
                            <button className="Login0" onClick={this.handleLogin}>Login</button>
                            <button className="acc-box0" onClick={this.handleAccnt}>Create an account</button>
                            </div> }

                    <Modal 
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                    >
                      
                        <div className="glyphicon glyphicon-remove" style={{ margin: '3px', left: '276px' }} onClick={this.handleClose}></div>
                            <div class="sign">Sign in</div>
                            <div>
                            <GoogleLogin 
                                clientId="606258026517-2eu9mh1129m9aksgbjtludnvorh13srb.apps.googleusercontent.com"
                                buttonText="Login with Google" 
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                                style={cssclass}
                                className="googleButton"
                            />
                                <br></br>
                                <br></br>
                            <FacebookLogin 
                                appId="131081762345225"
                                fields="name,email,picture"
                                textButton= "Login with Facebook"
                                callback={this.responseFacebook} /> 
                                 <br></br>
                                <br></br>
                                <div className="cred" onClick={this.handleCredential}>Continue with your Account</div>
                                <div className="line3" style={{ margin: '17px 0 10px', width: '224px'}}></div>
                                <div style={{marginTop: '20px', fontSize: '15px'}}>Don’t have account? <span style={{color: 'rgb(82, 21, 82)' }} onClick={this.handleAccnt}>Register</span></div>
                            </div>
                        
                    </Modal>

                    <Modal
                    isOpen={userCredentialIsOpen}
                    style={cstmStyles}
                    callback={this.responseUserCred}
                    >
                       
                        <div className="glyphicon glyphicon-remove" style={{ margin: '-1px', left: '291px'}} onClick={this.handleCredClose}></div>
                        
                        <div className="logo-e" style={{marginLeft: '115px', width: '40px', height: '40px', fontSize: '22px'}}>e!</div>
                        <div className="signupForm">Sign Up</div>    
                            <br></br>
                            <div className="line3" style={{ margin: '-10px 0 14px'}}></div>
                            
                        <div className="space">Email</div>
                        <input type="text" name ="email" onChange={this.handleUserLogin} className="form-control form-control-lg" style={{marginTop: '0px'}} placeholder="Enter your email id"/>
                        <div style={{fontSize: '12px', color: 'black', marginBottom: '10px'}}>We'll never share your email with anyone</div>

                        <div className="space">Password</div>
                        <input type="text" name ="password" onChange={this.handleUserLogin} className="form-control form-control-lg" style={{marginTop: "5px"}} placeholder="Enter your password"/>
                        
                        <button className="btn-success" onClick={this.handleLoginDetail} style={{textAlign: 'center', borderRadius: '6px', padding:'5px 10px 5px 10px', marginLeft: '-7px', marginTop: '16px', width:'105%', backgroundColor: 'green'}}>
                            Submit</button>
                        <br/>
                        <div className="line3" style={{ margin: '17px 0 10px'}}></div>
                        <div style={{marginLeft: '20px'}}>Don’t have an account?
                            <span style={{marginLeft: '5px', color: '#521552'}} onClick={this.handleAccnt}> SignUp </span>
                        </div>
                       
                    </Modal>

                    <Modal
                    isOpen={userModalIsOpen}
                    style={cstomStyles}
                    >
                        <div className="logo-e">e!</div> 
                         <div className="glyphicon glyphicon-remove" style={{ margin: '-1px', left: '291px'}} onClick={this.handleRemove}></div>
                            <div style={{fontWeight: '600', fontSize: '20px', marginLeft: '45px', marginTop: '14px'}}>Create an account</div> 
                            <div className="line3"></div>

                            <div style={{fontSize: '16px' }}>Gender:
                            <span><input type="radio" value="Male" name="gender" style={{ margin: '2px 0px 3px 11px' }} onChange={this.handleUserDetails}/> Male
                            <input type="radio" value="Female" name="gender" style={{marginLeft: '20px', marginBottom: '10px'}} onChange={this.handleUserDetails} /> Female
                            </span></div>
                            
                        <div className="space">First Name</div> 
                        <input type="text" name="firstname"  onChange={this.handleUserDetails} className="form-control form-control-lg" style={{marginTop: '5px'}} placeholder="Enter your first name"/>
                        

                        <div className="space">Last Name</div>
                        <input type="text"  name="lastname" onChange={this.handleUserDetails} className="form-control form-control-lg" style={{marginTop: '5px'}} placeholder="Enter your last name"/>
                        

                        <div className="space">Mobile Number</div>
                        <input type="text"  name="mobile" onChange={this.handleUserDetails} className="form-control form-control-lg" style={{marginTop: '5px'}}  placeholder="Enter your mobile number"/>
                        

                        <div className="space">Email</div>
                        <input type="text"  name="email" onChange={this.handleUserDetails} className="form-control form-control-lg" style={{marginTop: '5px'}}  placeholder="Enter your email id"/>
                        <div style={{fontSize: '12px', color: 'black', marginBottom: '10px'}}>We'll never share your email with anyone</div>
                    

                        <div style={{marginTop: '5px', fontSize: '16px', fontFamily: "Arial, Helvetica, sans-serif" }}>Password</div>
                        <input type="text" name="password" onChange={this.handleUserDetails} className="form-control form-control-lg" style={{marginTop: '5px'}} placeholder="Create your new password"/>
                                                
                        <input type="checkbox" style={{marginTop: '7px'}}/>
                        <span style={{position: 'absolute', marginLeft: '25px', lineHeight: '1.5', marginLeft: '7px', fontSize: '12px', color: 'black', marginTop: '5px', fontFamily: 'poppins' }}>Agree with term and condition</span>                        <br></br>

                        <button className="btn-success" style={{ width: '105%',textAlign: 'center', borderRadius: '6px', padding:'5px 10px 5px 10px', marginLeft: '-7px', marginTop: '16px', backgroundColor: 'green'}} onClick={this.handleCreateAccount}>Submit</button>                 
                    </Modal>
                    </div>  
        );                         
    }
}
export default Header;
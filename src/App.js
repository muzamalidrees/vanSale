import React from 'react';
import './App.css';
import Header from './components/misc/Header';
import Footer from './components/misc/Footer';
import { MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact'
import AllRoutes from "./components/misc/AllRoutes";
import { BrowserRouter, Redirect } from 'react-router-dom';
import { AbilityContext } from "./configs/Ability-context";
import defineRulesFor from "./configs/Ability";
import { Ability } from "@casl/ability";
import ReactSideBar from './components/misc/sections/ReactSideBar';


const ability = new Ability();

class App extends React.Component {
  _isMounted = false
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: '',
      roles: [],
      user: '',
      modalShow: false,
    }

    let a = fetch('/getAllRoles')
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        this.setState({ roles: json.data })
      })
      .catch((err => {
        console.log(err);
      }))

    let b = fetch('/isAuth')
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        this.setState({ loggedIn: json.loggedIn, user: json.user }, function () {
          if (json.loggedIn === false) {
            if (localStorage.getItem('ui') || localStorage.getItem('uri')) {
              localStorage.removeItem('ui')
              localStorage.removeItem('uri')
            }
          }
        })
      })
      .catch((err => {
        // console.log(err);
      }))

    Promise.all([a, b]).then(() => {

      let { user } = this.state
      if (user !== undefined && user !== null) {
        this.changeUser(user);
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  loggingOut = () => {
    fetch('/logout')
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        this.setState({
          loggedIn: false,
          modalShow: false
        }, function () {
          localStorage.removeItem('ui')
          localStorage.removeItem('uri')
        })
      })
      .catch((err) => console.log(err))
  }

  changeUser = (user) => {
    let userRole;
    if (this.state.roles) {
      this.state.roles.forEach(role => {
        if (role.id === user.role_id) {
          userRole = role.name
        }
      });
      if (userRole === 'driver') {
        this.setState({
          user: user,
          // modalShow: true
        })
      }
    }

    const rules = defineRulesFor(userRole);
    ability.update(rules);
    this.setState({ loggedIn: true })
  }

  toggle = () => {
    this.setState({
      modalShow: !this.state.modalShow,

    });
  }


  render() {


    return (
      <BrowserRouter>
        <AbilityContext.Provider value={ability}>

          {this.state.loggedIn === false ? <Redirect to='/login' /> : null}
          <div
          // style={{ marginLeft: '15%' }}
          >
            <Header
              loggedIn={this.state.loggedIn}
              loggingOut={this.loggingOut}
            />

            {/* Displaying driver's daily message.  */}
            <MDBModal ref='driverDailyMessage' modalStyle="info" className="text-white" size="sm" centered backdrop={true}
              isOpen={this.state.modalShow} toggle={() => { }}>
              <MDBModalHeader className="text-center" titleClass="w-100" tag="p">
                Message from admin...
              </MDBModalHeader>
              <MDBModalBody className="text-center">
                {this.state.user ? this.state.user.daily_message : null}
              </MDBModalBody>
              <MDBModalFooter className="justify-content-center">
                <MDBBtn size='sm' color="info" onClick={this.toggle}>OK</MDBBtn>
              </MDBModalFooter>
            </MDBModal>

            <AllRoutes
              changeUser={this.changeUser}
            />
            {/* <Footer /> */}
          </div >
        </AbilityContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;

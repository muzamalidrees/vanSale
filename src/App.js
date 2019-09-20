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
import ErrorBoundary from './components/misc/ErrorBoundary'
// import ReactSideBar from './components/misc/sections/ReactSideBar';


const ability = new Ability();

class App extends React.Component {
  _isMounted = false
  constructor(props) {

    super(props);
    this._isMounted = true
    this.state = {
      loggedIn: '',
      roles: [],
      user: '',
      modalShow: false,
    }

    let paths = ['/getAllRoles', '/isAuth']
    let dataRequests = paths.map(path => fetch(path))
    Promise.all(dataRequests)
      .then(responses => {
        Promise.all(responses.map(res => res.json()))
          .then(jsons => {
            let user = jsons[1].user;
            if (this._isMounted) {
              this.setState({
                roles: jsons[0].data,
                loggedIn: jsons[1].loggedIn,
                user: user
              },
                function () {
                  if (jsons[1].loggedIn === false) {
                    if (localStorage.getItem('ui') || localStorage.getItem('uri')) {
                      localStorage.removeItem('ui')
                      localStorage.removeItem('uri')
                    }
                  }
                  if (user !== undefined && user !== null) {
                    this.changeUser(user);
                  }
                }
              )
            }
          })
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
    this.state.roles &&
      this.state.roles.forEach(role => {
        if (role.id === user.role_id) {
          userRole = role.name
        }
      });
    if (userRole === 'driver') {
      this.setState({
        modalShow: true
      })
    }


    const rules = defineRulesFor(userRole);
    ability.update(rules);
    if (!this.state.loggedIn) {
      this.setState({ loggedIn: true })
    }
  }

  toggle = () => {
    this.setState({
      modalShow: !this.state.modalShow,
    });
  }


  render() {
    let { loggedIn, modalShow, user } = this.state


    return (
      <BrowserRouter>
        <AbilityContext.Provider value={ability}>
          {loggedIn === false ? <Redirect to='/login' /> : null}

          <div
          // style={{ marginLeft: '15%' }}
          >
            <Header
              loggedIn={loggedIn}
              loggingOut={this.loggingOut}
            />

            {/* Displaying driver's daily message.  */}
            <MDBModal ref='driverDailyMessage' modalStyle="info" className="text-white" size="sm" centered backdrop={true}
              isOpen={modalShow} toggle={() => { }}>
              <MDBModalHeader className="text-center" titleClass="w-100" tag="p">
                Message from admin...
              </MDBModalHeader>
              <MDBModalBody className="text-center">
                {user ? user.daily_message : null}
              </MDBModalBody>
              <MDBModalFooter className="justify-content-center">
                <MDBBtn size='sm' color="info" onClick={this.toggle}>OK</MDBBtn>
              </MDBModalFooter>
            </MDBModal>

            <AllRoutes
              changeUser={this.changeUser}
            />
            <Footer />
          </div >
        </AbilityContext.Provider>
      </BrowserRouter >
    );
  }
}

export default App;

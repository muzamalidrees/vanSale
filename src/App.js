import React from 'react';
import './App.css';
import Header from './components/misc/Header';
import Footer from './components/misc/Footer';
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
      loggedIn: false,
    }

    fetch('/isAuth')
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        this.setState({ loggedIn: json.loggedIn })
        // this.changeUser(json.user.role_id);
      })
      .catch((err => {
        console.log(err);
      }))
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
          loggedIn: false
        }, function () {
          localStorage.removeItem('ui')
          localStorage.removeItem('uri')
        })
      })
      .catch((err) => console.log(err))
  }

  changeUser = (x) => {
    var user;
    switch (x) {
      // case '8':
      //   user1 = 'superAdmin'
      //   break;
      case '1':
        user = 'admin'
        break;
      case '2':
        user = 'operator'
        break;
      // case '5':
      //   user1 = 'endUser'
      //   break;
    }
    const rules = defineRulesFor(user);
    ability.update(rules);
    this.setState({ loggedIn: true })
  }


  render() {


    return (
      <BrowserRouter>
        <AbilityContext.Provider value={ability}>
          {this.state.loggedIn === false ? <Redirect to='/login' /> : null}
          <div
            style={{ marginLeft: '15%' }}
          >
            <Header
              loggedIn={this.state.loggedIn}
              loggingOut={this.loggingOut}
            />
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

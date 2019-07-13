import React from 'react';
import './App.css';
import Header from './components/misc/Header';
import Footer from './components/misc/Footer';
import Routes from "./components/misc/Routes";
import { BrowserRouter } from 'react-router-dom';
import { AbilityContext } from "./configs/Ability-context";
import defineRulesFor from "./configs/Ability";
import { Ability } from "@casl/ability";


const ability = new Ability();

class App extends React.Component {
  _isMounted = false
  constructor(props) {
    super(props);
    // fetch('/isAuth')
    //   .then((res) => res.json())
    //   .then((json) => {
    //     // console.log(json)

    //     this.setState({ loggedIn: json.loggedIn })

    //     this.changeUser(json.user.role_id);
    //   })
    //   .catch((err => {
    //     console.log(err);
    //   }))
    this.state = {
      loggedIn: false,
    }
  }
  componentWillUnmount() {
    this._isMounted = false
  }

  loggedOut = () => {
    fetch('/logout')
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        this.setState({
          loggedIn: false
        })
      })
      .catch((err) => console.log(err))
  }

  changeUser = (x) => {
    // console.log(x);

    var user;
    switch (x) {
      // case '8':
      //   user1 = 'superAdmin'
      //   break;
      case '2':
        user = 'admin'
        break;
      case '1':
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
          <div>
            <Header
              loggedIn={this.state.loggedIn}
              loggedOut={this.loggedOut}
            />
            <Routes
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

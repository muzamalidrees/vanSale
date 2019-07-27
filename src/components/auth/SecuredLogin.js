import React, { Component } from 'react';
import Login from './pages/Login';
import { Redirect } from 'react-router-dom'



class SecuredLogin extends Component {
    loggedIn
    constructor() {
        super()
        this.user = localStorage.getItem('ui')
        // console.log(this.user);

        if (this.user !== null) {
            // console.log('user not null');
            this.loggedIn = true
        }
        else {
            // console.log('user null 2');
            this.loggedIn = false
        }
        // fetch('/isAuth')

        //     .then((res) => res.json())
        //     .then((json) => {
        //         console.log(json);
        //         if (this._isMounted === true) {

        //             this.setState({ loggedIn: json.loggedIn })
        //         }
        //     })
        //     .catch((err => {
        //         console.log(err);
        //     }))
    }

    render() {
        if (this.loggedIn === true) {
            return <Redirect to='/home' />
        }
        else {
            return <Login changeUser={this.props.changeUser} />
        }

    }
}



export default SecuredLogin
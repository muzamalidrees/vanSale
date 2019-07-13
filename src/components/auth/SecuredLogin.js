import React, { Component } from 'react';
import Login from './pages/Login';
import { Redirect } from 'react-router-dom'



class SecuredLogin extends Component {
    _isMounted = false
    state = {
        loggedIn: ''
    }
    constructor() {
        super()
        this._isMounted = true
        fetch('/isAuth')

            .then((res) => res.json())
            .then((json) => {
                // console.log(json);
                if (this._isMounted === true) {

                    this.setState({ loggedIn: json.loggedIn })
                }
            })
            .catch((err => {
                console.log(err);
            }))
    }
    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        if (this.state.loggedIn === true) {

            return <Redirect to='/home' />
        }
        else {
            return <Login changeUser={this.props.changeUser} />
        }

    }
}



export default SecuredLogin
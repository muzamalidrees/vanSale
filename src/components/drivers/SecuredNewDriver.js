import React, { Component } from 'react';
import NewDriver from './pages/NewDriver';
import { Redirect } from 'react-router'


class SecuredNewDriver extends Component {
    _isMounted = false
    state = {
        loggedIn: ''
    }
    constructor() {
        super()
        this._isMounted = true;
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
        this._isMounted = false;
    }

    render() {

        // if (this.state.loggedIn === false) {
        //     return <Redirect to='/login' />
        // }
        // else {
        return <NewDriver />
        // }

    }
}



export default SecuredNewDriver
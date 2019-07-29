import React, { Component } from 'react';
import NewSales from './pages/NewSales';
import { Redirect } from 'react-router'


class SecuredNewSales extends Component {
    _isMounted = false
    state = {
        loggedIn: true
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

        if (this.state.loggedIn === false) {
            return <Redirect to='/login' />
        }
        else {
            return <NewSales />
        }

    }
}



export default SecuredNewSales
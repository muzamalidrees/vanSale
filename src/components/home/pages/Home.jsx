import React, { Component } from 'react';
import { Can } from '../../../configs/Ability-context'


class Home extends Component {
    _isMounted = false
    constructor() {
        super();

        this.state = {
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    render() {

        return (
            <div>
                <h1 style={{ marginTop: '80px' }}>Home</h1>
            </div>
        );
    }

}

export default Home
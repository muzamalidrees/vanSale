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
            <div style={{marginTop:'72px'}}>
                Home
                Home
                Home
                Home
                Home
                Home
            </div>
        );
    }
}


export default Home
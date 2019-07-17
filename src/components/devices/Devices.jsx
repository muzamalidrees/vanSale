import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewDevice from './SecuredNewDevice';
import SecuredAllDevices from './SecuredAllDevices';



class Devices extends Component {
    constructor() {
        super();
        this.state = {
            // date: new Date(),
        };
    }

    render() {


        return (
            // <div>
            //     <h1 style={{ marginTop: '80px' }}>
            //         Devices Page
            //     </h1>
            // </div>
            <Switch>
                <Route path="/devices/new" component={SecuredNewDevice} />
                <Route path="/devices/all" component={SecuredAllDevices} />
            </Switch>

        )
    }
}


export default Devices
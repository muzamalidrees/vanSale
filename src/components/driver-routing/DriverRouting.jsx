import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredSetDriverRoutes from './SecuredSetDriverRoutes';
import SecuredAllDriverRoutes from './SecuredAllDriverRoutes';



class DriverRouting extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }

    render() {


        return (
            <Switch>
                {/* <Route path="/driverRouting/new" component={SecuredSetDriverRoutes} /> */}
                <Route path="/driverRouting/all" component={SecuredAllDriverRoutes} />
            </Switch>

        )
    }
}


export default DriverRouting
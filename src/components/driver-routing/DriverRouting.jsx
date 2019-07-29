import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredSetDriverRoutes from './SecuredSetDriverRoutes';
import AllDriverRoutes from './pages/AllDriverRoutes';



class DriverRouting extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }

    render() {


        return (
            // <div>
            //     <h1 style={{ marginTop: '80px' }}>
            //         Users Page
            //     </h1>
            // </div>
            <Switch>
                <Route path="/driverRouting/new" component={SecuredSetDriverRoutes} />
                <Route path="/driverRouting/all" component={AllDriverRoutes} />
            </Switch>

        )
    }
}


export default DriverRouting
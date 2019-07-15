import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewRoute from './SecuredNewRoute';
import SecuredAllRoutes from './SecuredAllRoutes';



class Routes extends Component {
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
                <Route path="/routes/new" component={SecuredNewRoute} />
                <Route path="/routes/all" component={SecuredAllRoutes} />
            </Switch>

        )
    }
}


export default Routes
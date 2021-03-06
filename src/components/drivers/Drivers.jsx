import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewDriver from './SecuredNewDriver';
import SecuredAllDrivers from './SecuredAllDrivers';



class Drivers extends Component {
    constructor() {
        super();
        this.state = {
        };
    }

    render() {


        return (
            <Switch>
                <Route path="/drivers/new" component={SecuredNewDriver} />
                <Route path="/drivers/all" component={SecuredAllDrivers} />
            </Switch>

        )
    }
}


export default Drivers
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewPermission from './SecuredNewPermission';
import SecuredAllPermissions from './SecuredAllPermissions';



class Permissions extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }


    render() {


        return (
            
            <Switch>
                <Route path="/permissions/new" component={SecuredNewPermission} />
                <Route path="/permissions/all" component={SecuredAllPermissions} />
            </Switch>

        )
    }
}


export default Permissions
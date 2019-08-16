
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredSetRolesPermissions from './SecuredSetRolesPermissions';
import SecuredAllRolesPermissions from './SecuredAllRolesPermissions';



class RolesPermissioning extends Component {


    render() {


        return (

            <Switch>
                <Route path="/rolePermissioning/new" component={SecuredSetRolesPermissions} />
                <Route path="/rolePermissioning/all" component={SecuredAllRolesPermissions} />
            </Switch>

        )
    }
}


export default RolesPermissioning
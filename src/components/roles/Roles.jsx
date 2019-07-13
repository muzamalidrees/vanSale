import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewRole from './SecuredNewRole';
import SecuredAllRoles from './SecuredAllRoles';



class Roles extends Component {
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
            //         Roles Page
            //     </h1>
            // </div>
            <Switch>
                <Route path="/roles/new" component={SecuredNewRole} />
                <Route path="/roles/all" component={SecuredAllRoles} />
            </Switch>

        )
    }
}


export default Roles
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredAllInventory from './SecuredAllInventory';
import SecuredNewInventory from './SecuredNewInventory';
import SecuredReturnInventory from './SecuredReturnInventory';
import SecuredInventoryHistory from './SecuredInventoryHistory';



class Inventory extends Component {
    constructor() {
        super();
        this.state = {
        };
    }

    render() {


        return (

            <Switch>
                <Route path="/inventory/new" component={SecuredNewInventory} />
                <Route path="/inventory/all" component={SecuredAllInventory} />
                <Route path="/inventory/return" component={SecuredReturnInventory} />
                <Route path="/inventory/history" component={SecuredInventoryHistory} />
            </Switch>

        )
    }
}


export default Inventory
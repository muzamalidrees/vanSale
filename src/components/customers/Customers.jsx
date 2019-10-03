import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewCustomer from './SecuredNewCustomer';
import SecuredAllCustomers from './SecuredAllCustomers';
import SelectedCustomer from './pages/SelectedCustomer';



class Customers extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }

    render() {

        return (
            <Switch>
                <Route path="/customers/new" component={SecuredNewCustomer} />
                <Route path="/customers/all" component={SecuredAllCustomers} />
                <Route path="/customers/customer" component={SelectedCustomer} />
            </Switch>

        )
    }
}


export default Customers
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredAllInvoices from './SecuredAllInvoices';
import CustomerInvoices from './pages/CustomerInvoices'



class Invoices extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }


    render() {

        return (

            <Switch>
                <Route path="/invoices/all" component={SecuredAllInvoices} />
                <Route path="/invoices/customer" component={CustomerInvoices} />
            </Switch>

        )
    }
}


export default Invoices
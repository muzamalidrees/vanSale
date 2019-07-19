import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredAllInvoices from './SecuredAllInvoices';



class Invoices extends Component {
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
            //         Orders Page
            //     </h1>
            // </div>
            <Switch>
                <Route path="/invoices/all" component={SecuredAllInvoices} />
            </Switch>

        )
    }
}


export default Invoices
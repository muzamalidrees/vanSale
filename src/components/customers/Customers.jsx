import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewCustomer from './SecuredNewCustomer';
import SecuredAllCustomers from './SecuredAllCustomers';



class Customers extends Component {
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
                <Route path="/customers/new" component={SecuredNewCustomer} />
                <Route path="/customers/all" component={SecuredAllCustomers} />
            </Switch>

        )
    }
}


export default Customers
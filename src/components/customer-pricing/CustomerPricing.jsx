import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredSetCustomerPrices from './SecuredSetCustomerPrices';
import AllCustomerPrices from './pages/AllCustomerPrices';



class CustomerPricing extends Component {
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
                <Route path="/customerPricing/new" component={SecuredSetCustomerPrices} />
                <Route path="/customerPricing/all" component={AllCustomerPrices} />
            </Switch>

        )
    }
}


export default CustomerPricing
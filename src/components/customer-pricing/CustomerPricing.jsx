import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SecuredSetCustomerPrices from './SecuredSetCustomerPrices';
import AllCustomerPrices from './pages/AllCustomerPrices';



class CustomerPricing extends Component {

    render() {

        return (
            <Switch>
                <Route path="/customerPricing/new" component={SecuredSetCustomerPrices} />
                <Route path="/customerPricing/all" component={AllCustomerPrices} />
            </Switch>

        )
    }
}


export default CustomerPricing
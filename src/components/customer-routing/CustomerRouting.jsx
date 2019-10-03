import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import AllCustomerRoutes from './pages/AllCustomerRoutes';



class CustomerRouting extends Component {

    render() {

        return (
            <Switch>
                <Route path="/customerRouting/all" component={AllCustomerRoutes} />
            </Switch>

        )
    }
}


export default CustomerRouting
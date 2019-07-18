import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import SecuredLogin from '../auth/SecuredLogin';
import SecuredHome from '../home/SecuredHome';
import Users from '../users/Users';
import Roles from '../roles/Roles';
import Products from '../products/Products';
import ProductCategories from '../product-categories/ProductCategories';
import Customers from '../customers/Customers';
import PriceGroups from '../price-groups/PriceGroups';
import CustomerPricing from '../customer-pricing/CustomerPricing';
import Drivers from '../drivers/Drivers';
import Routes from '../routes/Routes';
import Devices from '../devices/Devices';
import Home from '../home/pages/Home';
import ReactSideBar from './sections/ReactSideBar';



class AllRoutes extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }


    // componentDidMount() {
    //     this.timerID = setInterval(() => this.tick(), 1000);
    // }
    // componentWillUnmount() {
    //     clearInterval(this.timerID);
    // }
    // tick = () => {
    //     this.setState({ date: new Date() });
    // }

    render() {


        return (
            
            <div style={{}} className="container-fluid">
            
                <ReactSideBar />
                    <Switch>
                        {/* <Route exact path="/" render={() => (<SecuredLogin changeUser={this.props.changeUser} />)} /> */}
                        {/* <Route exact path="/login" render={() => (<SecuredLogin changeUser={this.props.changeUser} />)} /> */}
                        <Route exact path="/" component={Home} />
                        <Route path="/home" component={Home} />
                        <Route path="/users" component={Users} />
                        <Route path="/roles" component={Roles} />
                        <Route path="/products" component={Products} />
                        <Route path="/productCategories" component={ProductCategories} />
                        <Route path="/customers" component={Customers} />
                        <Route path="/priceGroups" component={PriceGroups} />
                        <Route path="/customerPricing" component={CustomerPricing} />
                        <Route path="/drivers" component={Drivers} />
                        <Route path="/routes" component={Routes} />
                        <Route path="/devices" component={Devices} />
                        <Route path='/' component={NotFound} />
                    </Switch>
                </div>

        )
    }
}


export default AllRoutes
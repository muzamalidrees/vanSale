import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import ProfilePage from './pages/ProfilePage';
import SecuredLogin from '../auth/SecuredLogin';
import SecuredHome from '../home/SecuredHome';
import Users from '../users/Users';
import Roles from '../roles/Roles';
import Permissions from '../permissions/Permissions';
import Products from '../products/Products';
import ProductCategories from '../product-categories/ProductCategories';
import Customers from '../customers/Customers';
import PriceGroups from '../price-groups/PriceGroups';
import CustomerPricing from '../customer-pricing/CustomerPricing';
import customerRouting from '../customer-routing/CustomerRouting';
import DriverRouting from '../driver-routing/DriverRouting';
import RolePermissioning from '../rolePermissioning/RolePermissioning';
import Drivers from '../drivers/Drivers';
import Operators from '../operators/Operators';
import Inventory from '../inventory/Inventory';
import Routes from '../routes/Routes';
import Devices from '../devices/Devices';
import Sales from '../sales/Sales';
import Returns from '../returns/Returns';
import Invoices from '../invoices/Invoices';
import Reporting from '../reporting/Reporting';
// import ReactSideBar from './sections/ReactSideBar';



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
            <React.Fragment>
                {/* <ReactSideBar /> */}
                <div style={{}} className="container-fluid">
                    <Switch>
                        <Route exact path="/" render={() => (<SecuredLogin changeUser={this.props.changeUser} />)} />
                        <Route exact path="/login" render={() => (<SecuredLogin changeUser={this.props.changeUser} />)} />
                        {/* <Route exact path="/" component={SecuredHome} /> */}
                        <Route path="/home" component={SecuredHome} />
                        <Route path="/myProfile" component={ProfilePage} />
                        <Route path="/users" component={Users} />
                        <Route path="/roles" component={Roles} />
                        <Route path="/permissions" component={Permissions} />
                        <Route path="/rolePermissioning" component={RolePermissioning} />
                        <Route path="/products" component={Products} />
                        <Route path="/productCategories" component={ProductCategories} />
                        <Route path="/customers" component={Customers} />
                        <Route path="/priceGroups" component={PriceGroups} />
                        <Route path="/customerPricing" component={CustomerPricing} />
                        <Route path="/customerRouting" component={customerRouting} />
                        <Route path="/driverRouting" component={DriverRouting} />
                        <Route path="/drivers" component={Drivers} />
                        <Route path="/operators" component={Operators} />
                        <Route path="/inventory" component={Inventory} />
                        <Route path="/routes" component={Routes} />
                        <Route path="/devices" component={Devices} />
                        <Route path="/sales" component={Sales} />
                        <Route path="/returns" component={Returns} />
                        <Route path="/invoices" component={Invoices} />
                        <Route path="/reporting" component={Reporting} />
                        <Route path='/' component={NotFound} />
                    </Switch>
                </div>
            </React.Fragment>
        )
    }
}


export default AllRoutes
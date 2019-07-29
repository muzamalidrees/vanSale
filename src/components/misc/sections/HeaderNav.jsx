import React from 'react';
import {
    MDBNavbarNav, MDBNavItem, MDBNavLink, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBIcon, MDBDropdownItem
} from "mdbreact";
import { Can } from "../../../configs/Ability-context";


class Header extends React.Component {
    _isMounted = false
    // shouldRedirect = false
    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleLogOut = this.handleLogOut.bind(this);

    }
    componentWillUnmount() {
        this._isMounted = false
    }
    handleLogOut = () => {
        this.props.loggingOut();
    }



    render() {
        return (

            <MDBCollapse id="navbarCollapse3" isOpen={this.props.collapse} navbar>
                <MDBNavbarNav right id='mainNav'>
                    {this.props.loggedIn ?
                        <React.Fragment>
                            <MDBNavItem >
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="home" > </MDBIcon>  Home
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="text-white">
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/home"><MDBIcon icon="home" /> Home</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* <Can I='create' a='sale'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/sales/new"><MDBIcon icon="plus" /> New Sales</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/sales/all"><MDBIcon icon="eye" /> All Sales</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* <Can I='create' a='return'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/returns/new"><MDBIcon icon="plus" /> New Returns</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/returns/all"><MDBIcon icon="eye" /> All Returns</MDBNavLink>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/invoices/all"><MDBIcon icon="eye" /> All Invoices</MDBNavLink>
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                                {/* <MDBNavLink to="/home"><MDBIcon icon="home" /> Home</MDBNavLink>  */}
                            </MDBNavItem>
                            {/* <Can I='read' a='user'> */}
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="users" > </MDBIcon>  Users
                                </MDBDropdownToggle>
                                    <MDBDropdownMenu className="text-white">
                                        {/* <Can I='create' a='user'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/users/new"><MDBIcon icon="plus" /> Create new User</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/users/all"><MDBIcon icon="eye" /> View Users</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* <Can I='create' a='role'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/roles/new"><MDBIcon icon="plus" /> Create new Role</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/roles/all"><MDBIcon icon="eye" /> User's Roles</MDBNavLink>
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                            {/* </Can> */}
                            {/* <Can I='read' a='user'> */}
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="cubes" > </MDBIcon>  Products
                                </MDBDropdownToggle>
                                    <MDBDropdownMenu className="text-white">
                                        {/* <Can I='create' a='product'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/products/new"><MDBIcon icon="plus" /> Create new Product</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/products/all"><MDBIcon icon="eye" /> View Products</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* <Can I='create' a='product-category'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/productCategories/new"><MDBIcon icon="plus" /> Create new Product-Category</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/productcategories/all"><MDBIcon icon="eye" />View Product-Categories</MDBNavLink>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/productPricing/new"><MDBIcon icon="eye" /> Product-Pricing</MDBNavLink>
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                            {/* </Can> */}
                            {/* <Can I='read' a='customer'> */}
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="user-friends" > </MDBIcon>  Customers
                                </MDBDropdownToggle>
                                    <MDBDropdownMenu className="text-white">
                                        {/* <Can I='create' a='customer'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/customers/new"><MDBIcon icon="plus" /> Create new Customer</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/customers/all"><MDBIcon icon="eye" /> View Customers</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* <Can I='create' a='price-group'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/priceGroups/new"><MDBIcon icon="plus" /> Create new Price-Group</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/priceGroups/all"><MDBIcon icon="eye" /> View Price-Groups</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* <Can I='set' a='customer-price'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/customerPricing/new"><MDBIcon icon="eye" /> Customer-Pricing</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                            {/* </Can> */}
                            {/* <Can I='read' a='driver'> */}
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="user-tie" > </MDBIcon>  Drivers
                                </MDBDropdownToggle>
                                    <MDBDropdownMenu className="text-white">
                                        {/* <Can I='create' a='driver'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/drivers/new"><MDBIcon icon="plus" /> Create new Driver</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/drivers/all"><MDBIcon icon="eye" /> View Drivers</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* <Can I='create' a='route'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/routes/new"><MDBIcon icon="plus" /> Create new Route</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/routes/all"><MDBIcon icon="eye" /> View Routes</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* <Can I='create' a='device'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/devices/new"><MDBIcon icon="plus" /> Create new Device</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/devices/all"><MDBIcon icon="eye" /> View Devices</MDBNavLink>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/driverRouting/new"><MDBIcon icon="eye" /> Driver-Routing</MDBNavLink>
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                            {/* </Can> */}
                            {/* <Can I='read' a='user'> */}
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="boxes" > </MDBIcon>  Inventory
                                </MDBDropdownToggle>
                                    <MDBDropdownMenu className="text-white">
                                        {/* <Can I='create' a='user'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/users/new"><MDBIcon icon="plus" /> Create new User</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/users/all"><MDBIcon icon="eye" /> View Users</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* <Can I='create' a='role'> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/roles/new"><MDBIcon icon="plus" /> Create new Role</MDBNavLink>
                                        </MDBDropdownItem>
                                        {/* </Can> */}
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to="/roles/all"><MDBIcon icon="eye" /> User's Roles</MDBNavLink>
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                            {/* </Can> */}
                        </React.Fragment>
                        :
                        null
                    }
                </MDBNavbarNav>
                <MDBNavbarNav right id='secondNav'>
                    <MDBNavItem id='profileBtn' style={{ display: '' }}>
                        <MDBDropdown>
                            <MDBDropdownToggle nav caret>
                                <MDBIcon icon="user" className="mr-1" />
                            </MDBDropdownToggle>
                            <MDBDropdownMenu className="dropdown-default" right>
                                {this.props.loggedIn ?
                                    <MDBDropdownItem>
                                        <MDBNavLink style={{ color: '#000000' }} onClick={this.handleLogOut} to=''>
                                            Log Out
                                        </MDBNavLink>
                                    </MDBDropdownItem>
                                    :
                                    <MDBDropdownItem>
                                        <MDBNavLink style={{ color: '#000000' }} to="/login">
                                            Log In
                                        </MDBNavLink>
                                    </MDBDropdownItem>
                                }
                            </MDBDropdownMenu>
                        </MDBDropdown>
                    </MDBNavItem>
                </MDBNavbarNav>
            </MDBCollapse>

        );
    }
}

export default Header
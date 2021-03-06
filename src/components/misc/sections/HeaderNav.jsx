import React from 'react';
import {
    MDBNavbarNav, MDBNavItem, MDBNavLink, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBIcon, MDBDropdownItem, MDBNavbarBrand
} from "mdbreact";
import { Can } from "../../../configs/Ability-context";


class HeaderNav extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props);
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
                                        <Can I='create' a='sales'>
                                            <MDBDropdownItem>
                                                <MDBNavLink style={{ color: '#000000' }} to="/sales/new"><MDBIcon icon="plus" /> New Sales</MDBNavLink>
                                            </MDBDropdownItem>
                                        </Can>
                                        <Can I='read' a='sales'>
                                            <MDBDropdownItem>
                                                <MDBNavLink style={{ color: '#000000' }} to="/sales/all"><MDBIcon icon="eye" /> All Sales</MDBNavLink>
                                            </MDBDropdownItem>
                                        </Can>
                                        <Can I='create' a='returns'>
                                            <MDBDropdownItem>
                                                <MDBNavLink style={{ color: '#000000' }} to="/returns/new"><MDBIcon icon="plus" /> New Returns</MDBNavLink>
                                            </MDBDropdownItem>
                                        </Can>
                                        <Can I='read' a='returns'>
                                            <MDBDropdownItem>
                                                <MDBNavLink style={{ color: '#000000' }} to="/returns/all"><MDBIcon icon="eye" /> All Returns</MDBNavLink>
                                            </MDBDropdownItem>
                                        </Can>
                                        <Can I='read' a='invoice'>
                                            <MDBDropdownItem>
                                                <MDBNavLink style={{ color: '#000000' }} to="/invoices/all"><MDBIcon icon="eye" /> All Invoices</MDBNavLink>
                                            </MDBDropdownItem>
                                        </Can>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                                {/* <MDBNavLink to="/home"><MDBIcon icon="home" /> Home</MDBNavLink>  */}
                            </MDBNavItem>
                            <Can I='read' a='user'>
                                <MDBNavItem>
                                    <MDBDropdown>
                                        <MDBDropdownToggle nav caret>
                                            <MDBIcon icon="users" > </MDBIcon>  Users
                                        </MDBDropdownToggle>
                                        <MDBDropdownMenu className="text-white">
                                            <Can I='create' a='user'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/users/new"><MDBIcon icon="plus" /> Create new User</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='user'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/users/all"><MDBIcon icon="eye" /> View Users</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='create' a='role'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/roles/new"><MDBIcon icon="plus" /> Create new Role</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='role'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/roles/all"><MDBIcon icon="eye" /> User's Roles</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='create' a='permission'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/permissions/new"><MDBIcon icon="plus" /> Create new Permission</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='permission'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/permissions/all"><MDBIcon icon="eye" /> Roles' Permissions</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='set' a='rolePermission'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/rolePermissioning/new"><MDBIcon icon="pencil-alt" /> Role Permissioning</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                        </MDBDropdownMenu>
                                    </MDBDropdown>
                                </MDBNavItem>
                            </Can>
                            <Can I='read' a='product'>
                                <MDBNavItem>
                                    <MDBDropdown>
                                        <MDBDropdownToggle nav caret>
                                            <MDBIcon icon="cubes" > </MDBIcon>  Products
                                        </MDBDropdownToggle>
                                        <MDBDropdownMenu className="text-white">
                                            <Can I='create' a='product'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/products/new"><MDBIcon icon="plus" /> Create new Product</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='product'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/products/all"><MDBIcon icon="eye" /> View Products</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='create' a='productCategory'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/productCategories/new"><MDBIcon icon="plus" /> Create new Product-Category</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='productCategory'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/productcategories/all"><MDBIcon icon="eye" />View Product-Categories</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                        </MDBDropdownMenu>
                                    </MDBDropdown>
                                </MDBNavItem>
                            </Can>
                            <Can I='read' a='customer'>
                                <MDBNavItem>
                                    <MDBDropdown>
                                        <MDBDropdownToggle nav caret>
                                            <MDBIcon icon="user-friends" > </MDBIcon>  Customers
                                        </MDBDropdownToggle>
                                        <MDBDropdownMenu className="text-white">
                                            <Can I='create' a='customer'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/customers/new"><MDBIcon icon="plus" /> Create new Customer</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='customer'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/customers/all"><MDBIcon icon="eye" /> View Customers</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='customerRoute'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/customerRouting/all"><MDBIcon icon="eye" /> View Customers'Routes</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                        </MDBDropdownMenu>
                                    </MDBDropdown>
                                </MDBNavItem>
                            </Can>
                            <Can I='read' a='priceGroup'>
                                <MDBNavItem>
                                    <MDBDropdown>
                                        <MDBDropdownToggle nav caret>
                                            <MDBIcon icon="object-group" > </MDBIcon>  Price-Groups
                                        </MDBDropdownToggle>
                                        <MDBDropdownMenu className="text-white">
                                            <Can I='create' a='priceGroup'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/priceGroups/new"><MDBIcon icon="plus" /> Create new Price-Group</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='priceGroup'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/priceGroups/all"><MDBIcon icon="eye" /> View Price-Groups</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='customerPrice'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/customerPricing/all"><MDBIcon icon="eye" /> View Customers' Prices</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                        </MDBDropdownMenu>
                                    </MDBDropdown>
                                </MDBNavItem>
                            </Can>
                            <Can I='read' a='driver'>
                                <MDBNavItem>
                                    <MDBDropdown>
                                        <MDBDropdownToggle nav caret>
                                            <MDBIcon icon="user-tie" > </MDBIcon>  Drivers
                                        </MDBDropdownToggle>
                                        <MDBDropdownMenu className="text-white">
                                            <Can I='create' a='driver'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/drivers/new"><MDBIcon icon="plus" /> Create new Driver</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='driver'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/drivers/all"><MDBIcon icon="eye" /> View Drivers</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='create' a='route'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/routes/new"><MDBIcon icon="plus" /> Create new Route</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='route'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/routes/all"><MDBIcon icon="eye" /> View Routes</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='create' a='device'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/devices/new"><MDBIcon icon="plus" /> Create new Device</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='device'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/devices/all"><MDBIcon icon="eye" /> View Devices</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='driverRoute'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/driverRouting/all"><MDBIcon icon="eye" /> View Drivers' Routes</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                        </MDBDropdownMenu>
                                    </MDBDropdown>
                                </MDBNavItem>
                            </Can>
                            <Can I='read' a='operator'>
                                <MDBNavItem>
                                    <MDBDropdown>
                                        <MDBDropdownToggle nav caret>
                                            <MDBIcon icon="user-tie" > </MDBIcon>  Operators
                                        </MDBDropdownToggle>
                                        <MDBDropdownMenu className="text-white">
                                            <Can I='create' a='operator'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/operators/new"><MDBIcon icon="plus" /> Create new Operator</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='operator'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/operators/all"><MDBIcon icon="eye" /> View Operators</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                        </MDBDropdownMenu>
                                    </MDBDropdown>
                                </MDBNavItem>
                            </Can>
                            <Can I='read' a='driverInventories'>
                                <MDBNavItem>
                                    <MDBDropdown>
                                        <MDBDropdownToggle nav caret>
                                            <MDBIcon icon="boxes" > </MDBIcon>  Inventory
                                        </MDBDropdownToggle>
                                        <MDBDropdownMenu className="text-white">
                                            <Can I='read' a='driverInventories'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/inventory/new"><MDBIcon icon="plus" /> Allocate new Inventory</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='driverInventories'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/inventory/return"><MDBIcon icon="arrow-left" /> Return Inventories</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='driverInventories'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/inventory/all"><MDBIcon icon="eye" /> View Inventories</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                            <Can I='read' a='inventoryHistories'>
                                                <MDBDropdownItem>
                                                    <MDBNavLink style={{ color: '#000000' }} to="/inventory/history"><MDBIcon icon="history" /> View Inventory History</MDBNavLink>
                                                </MDBDropdownItem>
                                            </Can>
                                        </MDBDropdownMenu>
                                    </MDBDropdown>
                                </MDBNavItem>
                            </Can>
                            <Can I='read' a='report'>
                                <MDBNavItem>
                                    <MDBNavLink style={{ color: '#ffffff' }} to='/reporting'>
                                        Reporting
                                    </MDBNavLink>
                                </MDBNavItem>
                            </Can>
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
                                    <React.Fragment>
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} to='/myProfile'>
                                                My Profile
                                            </MDBNavLink>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem>
                                            <MDBNavLink style={{ color: '#000000' }} onClick={this.handleLogOut} to=''>
                                                Log Out
                                        </MDBNavLink>
                                        </MDBDropdownItem>
                                    </React.Fragment>
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

export default HeaderNav
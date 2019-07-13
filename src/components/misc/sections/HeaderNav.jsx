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
        this.props.loggedOut();
    }



    render() {
        return (

            <MDBCollapse id="navbarCollapse3" isOpen={this.props.collapse} navbar>
                <MDBNavbarNav right id='mainNav'>
                    {/* {this.props.loggedIn ? */}
                    <React.Fragment>
                        <MDBNavItem >
                            <MDBNavLink to="/home"><MDBIcon icon="home" /> Home</MDBNavLink>
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
                                        <MDBNavLink style={{ color: '#008066' }} to="/users/new"><MDBIcon icon="plus" /> Create new User</MDBNavLink>
                                    </MDBDropdownItem>
                                    {/* </Can> */}
                                    <MDBDropdownItem>
                                        <MDBNavLink style={{ color: '#008066' }} to="/users/all"><MDBIcon icon="eye" /> View Users</MDBNavLink>
                                    </MDBDropdownItem>
                                    {/* <Can I='create' a='role'> */}
                                    <MDBDropdownItem>
                                        <MDBNavLink style={{ color: '#008066' }} to="/roles/new"><MDBIcon icon="plus" /> Create new Role</MDBNavLink>
                                    </MDBDropdownItem>
                                    {/* </Can> */}
                                    <MDBDropdownItem>
                                        <MDBNavLink style={{ color: '#008066' }} to="/roles/all"><MDBIcon icon="eye" /> User's Roles</MDBNavLink>
                                    </MDBDropdownItem>
                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </MDBNavItem>
                        {/* </Can> */}
                        {/* <MDBNavItem >
                                <MDBNavLink to="/users">Users</MDBNavLink>
                            </MDBNavItem> */}
                    </React.Fragment>
                    {/* : */}
                    {/* null */}
                    {/* } */}
                    {/* <MDBNavItem>
                        <MDBNavLink to="#">Inventory</MDBNavLink>
                    </MDBNavItem> */}

                </MDBNavbarNav>
                <MDBNavbarNav right id='secondNav'>
                    {/* <MDBNavItem>
                        <MDBNavLink className="waves-effect waves-light" to="#!">
                            <MDBIcon fab icon="twitter" />
                        </MDBNavLink>
                    </MDBNavItem> */}

                    <MDBNavItem id='profileBtn' style={{ display: '' }}>
                        <MDBDropdown>
                            <MDBDropdownToggle nav caret>
                                <MDBIcon icon="user" className="mr-1" />
                            </MDBDropdownToggle>
                            <MDBDropdownMenu className="dropdown-default" right>
                                {/* {this.props.loggedIn ? */}
                                <MDBDropdownItem>
                                    <MDBNavLink style={{ color: '#008066' }} onClick={this.handleLogOut} to="/login">
                                        Log Out
                                        </MDBNavLink>
                                </MDBDropdownItem>
                                {/* : */}
                                <MDBDropdownItem>
                                    <MDBNavLink style={{ color: '#008066' }} to="/login">
                                        Log In
                                        </MDBNavLink>
                                </MDBDropdownItem>
                                {/* } */}
                                {/* <MDBDropdownItem href="#!">Another Action</MDBDropdownItem> */}
                            </MDBDropdownMenu>
                        </MDBDropdown>
                    </MDBNavItem>
                </MDBNavbarNav>
            </MDBCollapse>

        );
    }
}

export default Header
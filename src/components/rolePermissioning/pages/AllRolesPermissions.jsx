import React, { Component } from 'react';
import {
    MDBDataTable, MDBCardHeader, MDBBtn,
    MDBIcon, MDBContainer, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink
} from 'mdbreact';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllRolesPermissions extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllRolesPermissions')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ rolesPermissions: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllRoles')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ roles: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllPermissions')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ permissions: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            rolesPermissions: [],
            roles: [],
            permissions: [],
            dRowValue: '',
            activeItem: 1
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };


    handleDelete = (id) => (e) => {
        let el = e.target
        let row = el.closest('tr')
        var i = row.rowIndex;
        this.setState({
            rowToBeDeleted: i,
            dRowValue: id
        })
        this.refs.deleteModal.setState({
            modalShow: true,
        })
    }

    deleteRolePermission = () => {
        let dRowValue = this.state.dRowValue
        let rolePermission = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(rolePermission),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteRolePermission', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                window.location.reload()
            })
            .catch((error) => console.log(error))
    }


    render() {
        var { roles, permissions, rolesPermissions, activeItem } = this.state;
        let Tabs = [], navLinks = [], currentComponent = this
        roles.forEach(role => {
            navLinks.push(makeNavLink(role))
            Tabs.push(makeTab(role, permissions, rolesPermissions))
        })
        function makeNavLink(role) {
            return (
                <MDBNavItem key={role.id} className='my-3 navLinkRP'>
                    <MDBNavLink to="#"
                        active={activeItem === role.id}
                        onClick={currentComponent.toggle(role.id)}
                        role="tab"
                        style={{ backgroundColor: activeItem === role.id ? '#00796b' :'', color: 'white', border: 'none', borderRadius: '5px', lineHeight: '15px' }}
                        className='' >
                        {role.name}
                    </MDBNavLink>
                </MDBNavItem >
            )
        }
        function makeTab(role, permissions, rolesPermissions) {
            var index = 0, currentPermission, rows = []

            rolesPermissions.forEach((rolePermission) => {
                if (rolePermission.role_id === role.id) {
                    index = index + 1;
                    if (permissions !== '' && permissions !== null && permissions !== undefined) {
                        permissions.forEach(permission => {
                            if (permission.id === rolePermission.permission_id) {
                                currentPermission = permission.slug
                            }
                        });
                    }
                    rows.push(
                        {
                            index: index,
                            role: role.name,
                            permission: currentPermission,
                            buttons: <React.Fragment>
                                <Can I='delete' a='rolePermission'>
                                    <MDBBtn style={{ fontSize: '15px' }} onClick={currentComponent.handleDelete(rolePermission.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                                </Can>
                            </React.Fragment>
                        }
                    );
                }
            });

            var data = {
                columns: [
                    { label: '#', field: 'index', },
                    { label: 'Role', field: 'role' },
                    { label: 'Permission', field: 'permission', },
                    { label: 'Action', field: 'buttons' }
                ],
                rows: rows
            }
            return (
                <MDBTabPane tabId={role.id} role="tabpanel" key={role.id}>
                    <MDBDataTable striped small hover theadColor="dark"
                        bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                        data={data} theadTextWhite >
                    </MDBDataTable>
                </MDBTabPane>
            )
        }


        return (
            <Can I='read' a='rolePermission'>
                <MDBContainer style={{ marginTop: '70px' }}>
                    <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                        Roles' Permissions
                    </MDBCardHeader>
                    <MDBNav className="nav-tabs mt-5 mx-5 pl-4 mb-0" style={{ borderRadius: '7px', backgroundColor: '#2BBBAD', lineHeight: '30px' }}>
                        {navLinks}
                    </MDBNav>
                    <MDBTabContent activeItem={activeItem} className='card p-5'>
                        {Tabs}
                    </MDBTabContent>
                    <DeleteModal
                        ref='deleteModal'
                        deleteEntry={this.deleteRolePermission}
                    />
                </MDBContainer>
            </Can>
        );
    }
}

export default AllRolesPermissions
import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
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
            rowToBeDeleted: '',
            dRowValue: '',
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }


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
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('rolesPermissioning').deleteRow(rowToBeDeleted)
        let rolePermission = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(rolePermission),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteRolePermission', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                window.location.reload()
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { roles, permissions, rolesPermissions } = this.state;
        var rows = [];
        var index = 0;

        rolesPermissions.forEach((rolePermission) => {

            index = index + 1;
            let currentRole, currentPermission
            if (roles !== '' && roles !== null && roles !== undefined) {
                roles.forEach(role => {
                    if (role.id === rolePermission.role_id) {
                        currentRole = role.name
                    }
                });
            }
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
                    role: currentRole,
                    permission: currentPermission,
                    buttons: <React.Fragment>
                        <Can I='delete' a='rolePermission'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(rolePermission.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
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

            <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                    Roles' Permission
                </MDBCardHeader>
                <MDBCardBody className='p-2'>

                    <MDBDataTable id='rolesPermissioning' striped small hover theadColor="dark"
                        bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                        data={data} theadTextWhite >
                    </MDBDataTable>
                    <DeleteModal
                        ref='deleteModal'
                        deleteEntry={this.deleteRolePermission}
                    />
                </MDBCardBody>
            </MDBCard>
        );
    }

}

export default AllRolesPermissions
import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import EditDriverModal from './sections/EditDriverModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllDrivers extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllUsers')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ users: json.data })
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
        this.state = {
            users: [],
            rowToBeDeleted: '',
            dRowValue: '',
            roles: '',
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }


    handleEdit = (id) => (e) => {
        this.refs.editUserModal.setState({
            modalShow: true
        })
        this.refs.editUserModal.fetchData(id);
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

    deleteDriver = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('usersTable').deleteRow(rowToBeDeleted)
        let user = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteUser', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { users, roles } = this.state;
        var rows = [];
        var index = 0;

        users.forEach((user) => {

            index = index + 1;
            let currentRole;
            if (roles !== '' && roles !== null && roles !== undefined) {
                roles.forEach(role => {
                    if (role.id.toString() === user.role_id) {
                        currentRole = role.name
                    }
                });
            }
            rows.push(
                {
                    index: index,
                    name: user.name,
                    email: user.email,
                    cell: user.cell,
                    username: user.username,
                    // password: user.password,
                    role: currentRole,
                    buttons: <React.Fragment>
                        <Can I='update' a='user'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(user.id)} className='m-1 py-1 px-2' outline color='teal' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can>
                        <Can I='delete' a='user'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(user.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Name', field: 'name' },
                { label: 'Email', field: 'email', }, { label: 'Cell', field: 'cell', },
                { label: 'Username', field: 'username', }, { label: 'Role', field: 'role', },
                { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (

            <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                    Users
                </MDBCardHeader>
                <MDBCardBody className='p-2'>

                    <MDBDataTable id='usersTable' striped small hover theadColor="teal"
                        bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                        data={data} theadTextWhite >
                    </MDBDataTable>
                    <EditDriverModal
                        ref='editDriverModal'
                    />
                    <DeleteModal
                        ref='deleteModal'
                        deleteEntry={this.deleteDriver}
                    />
                </MDBCardBody>
            </MDBCard>
        );
    }

}

export default AllDrivers
import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import ViewInventoryModal from '../sections/ViewInventoryModal';
import EditPersonModal from '../sections/EditPersonModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllPersons extends Component {
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
            roles: [],
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    handleViewInventory = (id) => (e) => {

        this.refs.viewInventoryModal.setState({
            modalShow: true
        })
        this.refs.viewInventoryModal.fetchData(id);
    }


    handleEdit = (id) => (e) => {
        this.refs.editPersonModal.setState({
            modalShow: true
        })
        this.refs.editPersonModal.fetchData(id);
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

    deletePerson = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('personsTable').deleteRow(rowToBeDeleted)
        let user = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteUser', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
            })
            .catch((error) => console.log(error))
    }

    defineEditProp = () => {
        let edit;
        switch (this.props.all) {
            case 'Users':
                edit = 'User'
                break;
            case 'Drivers':
                edit = 'Driver'
                break;
            case 'Operators':
                edit = 'operator'
                break;
            default:
                break;
        }
        return edit
    }



    render() {
        var { users, roles } = this.state;
        var rows = [];
        var data;
        var index = 0;
        switch (this.props.all) {
            case 'Users':
                users.forEach((user) => {
                    index = index + 1;
                    let currentRole;
                    if (roles !== '' && roles !== null && roles !== undefined) {
                        roles.forEach(role => {
                            if (role.id === user.role_id) {
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
                            address: user.address,
                            username: currentRole === 'super_admin' ? 'superAdmin' : user.username,
                            // password: user.password,
                            role: currentRole,
                            location: user.location,
                            dailyMessage: user.daily_message,
                            buttons: <React.Fragment>
                                <Can I='update' a={currentRole === 'super_admin' ? 'superAdmin' : 'user'}>
                                    <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(user.id)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                                </Can>
                                <Can I='delete' a={currentRole === 'super_admin' ? 'superAdmin' : 'user'}>
                                    <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(user.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                                </Can>
                            </React.Fragment>
                        }
                    );
                });
                data = {
                    columns: [
                        { label: '#', field: 'index', }, { label: 'Name', field: 'name' },
                        { label: 'Email', field: 'email', }, { label: 'Cell', field: 'cell', },
                        { label: 'Address', field: 'address', }, { label: 'Username', field: 'username', },
                        { label: 'Role', field: 'role', }, { label: 'Location', field: 'Location', },
                        { label: 'Daily-Message', field: 'dailyMessage' }, { label: 'Action', field: 'buttons' }
                    ],
                    rows: rows
                }
                break;
            case 'Drivers':
                let roleId;
                if (roles !== '' && roles !== null && roles !== undefined) {
                    roles.forEach(role => {
                        if (role.name === 'driver') {
                            roleId = role.id
                        }
                    })
                }
                let drivers = users.filter(user => user.role_id === roleId)
                drivers.forEach((driver) => {
                    index = index + 1;
                    rows.push(
                        {
                            index: index,
                            name: driver.name,
                            email: driver.email,
                            cell: driver.cell,
                            address: driver.address,
                            username: driver.username,
                            // password: user.password,
                            dailyMessage: driver.daily_message,
                            buttons: <React.Fragment>
                                <Can I='read' a='driverInventories'>
                                    <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleViewInventory(driver.id)} className='m-1 py-1 px-2' outline color='secondary' size="sm"><MDBIcon icon="boxes" /></MDBBtn>
                                </Can>
                                <Can I='update' a='driver'>
                                    <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(driver.id)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                                </Can>
                                <Can I='delete' a='driver'>
                                    <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(driver.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                                </Can>
                            </React.Fragment>
                        }
                    );
                });
                data = {
                    columns: [
                        { label: '#', field: 'index', }, { label: 'Name', field: 'name' },
                        { label: 'Email', field: 'email', }, { label: 'Cell', field: 'cell', },
                        { label: 'Address', field: 'address', }, { label: 'Username', field: 'username', },
                        { label: 'Daily-Message', field: 'dailyMessage' }, { label: 'Action', field: 'buttons' }
                    ],
                    rows: rows
                }
                break;
            case 'Operators':
                let RoleId;
                if (roles !== '' && roles !== null && roles !== undefined) {
                    roles.forEach(role => {
                        if (role.name === 'operator') {
                            RoleId = role.id
                        }
                    })
                }
                let operators = users.filter(user => user.role_id === RoleId)
                operators.forEach((operator) => {
                    index = index + 1;
                    rows.push(
                        {
                            index: index,
                            name: operator.name,
                            email: operator.email,
                            cell: operator.cell,
                            address: operator.address,
                            username: operator.username,
                            // password: user.password,
                            location: operator.location,
                            buttons: <React.Fragment>
                                <Can I='read' a='operatorInventories'>
                                    <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleViewInventory(operator.id)} className='m-1 py-1 px-2' outline color='secondary' size="sm"><MDBIcon icon="boxes" /></MDBBtn>
                                </Can>
                                <Can I='update' a='operator'>
                                    <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(operator.id)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                                </Can>
                                <Can I='delete' a='operator'>
                                    <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(operator.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                                </Can>
                            </React.Fragment>
                        }
                    );
                });
                data = {
                    columns: [
                        { label: '#', field: 'index', }, { label: 'Name', field: 'name' },
                        { label: 'Email', field: 'email', }, { label: 'Cell', field: 'cell', },
                        { label: 'Address', field: 'address', }, { label: 'Username', field: 'username', },
                        { label: 'Location', field: 'location' }, { label: 'Action', field: 'buttons' }
                    ],
                    rows: rows
                }
                break;

            default:
                break;
        }


        return (

            <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                    {this.props.all}
                </MDBCardHeader>
                <MDBCardBody className='p-2'>

                    <MDBDataTable id='personsTable' striped small hover theadColor="dark"
                        bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                        data={data} theadTextWhite >
                    </MDBDataTable>
                    <ViewInventoryModal
                        ref='viewInventoryModal'
                    />
                    <EditPersonModal
                        ref='editPersonModal'
                        edit={this.defineEditProp()}
                    />
                    <DeleteModal
                        ref='deleteModal'
                        deleteEntry={this.deletePerson}
                    />
                </MDBCardBody>
            </MDBCard>
        );
    }

}

export default AllPersons
import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import EditDeviceModal from './sections/EditDeviceModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllDevices extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllDevices')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ devices: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllUsers')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
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
            devices: [],
            rowToBeDeleted: '',
            dRowValue: '',
            users: [],
            roles: [],
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }


    handleEdit = (id) => (e) => {
        this.refs.editDeviceModal.setState({
            modalShow: true
        })
        this.refs.editDeviceModal.fetchData(id);
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

    deleteDevice = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('devicesTable').deleteRow(rowToBeDeleted)
        let device = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(device),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteDevice', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { devices, users, roles } = this.state;
        var rows = [];
        var index = 0;
        let roleId;
        if (roles !== '' && roles !== null && roles !== undefined) {
            roles.forEach(role => {
                if (role.name === 'driver') {
                    roleId = role.id
                }
            })
        }
        let drivers = users.filter(user => user.role_id === roleId)
        devices.forEach((device) => {

            index = index + 1;
            let currentDriver;
            if (drivers !== '' && drivers !== null && drivers !== undefined) {
                drivers.forEach(driver => {
                    if (driver.id === device.driver_id) {
                        currentDriver = driver.name
                    }
                });
            }
            rows.push(
                {
                    index: index,
                    IMEI: device.IMEI,
                    driver: currentDriver,
                    buttons: <React.Fragment>
                        <Can I='update' a='device'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(device.id)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can>
                        <Can I='delete' a='device'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(device.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'IMEI', field: 'IMEI' },
                { label: 'Driver', field: 'driver', }, { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (
            <Can I='read' a='device'>
                <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                    <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                        All Devices
                </MDBCardHeader>
                    <MDBCardBody className='p-2'>

                        <MDBDataTable id='devicesTable' striped small hover theadColor="dark"
                            bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                            data={data} theadTextWhite >
                        </MDBDataTable>
                        <EditDeviceModal
                            ref='editDeviceModal'
                        />
                        <DeleteModal
                            ref='deleteModal'
                            deleteEntry={this.deleteDevice}
                        />
                    </MDBCardBody>
                </MDBCard>
            </Can>
        );
    }

}

export default AllDevices
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
        fetch('/getAllDrivers')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ drivers: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllRoutes')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ routes: json.data })
                }
            })
            .catch((error) => console.log(error))
        this.state = {
            drivers: [],
            rowToBeDeleted: '',
            dRowValue: '',
            routes: [],
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }


    handleEdit = (id) => (e) => {
        this.refs.editDriverModal.setState({
            modalShow: true
        })
        this.refs.editDriverModal.fetchData(id);
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
        document.getElementById('driversTable').deleteRow(rowToBeDeleted)
        let driver = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(driver),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteDriver', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { drivers, routes } = this.state;
        var rows = [];
        var index = 0;

        drivers.forEach((driver) => {

            index = index + 1;
            let currentRoute;
            if (routes !== '' && routes !== null && routes !== undefined) {
                routes.forEach(route => {
                    if (route.id.toString() === driver.route_id) {
                        currentRoute = route.name
                    }
                });
            }
            rows.push(
                {
                    index: index,
                    driver_id: driver.driver_id,
                    name: driver.name,
                    email: driver.email,
                    cell: driver.cell,
                    address: driver.caddressell,
                    dailyMessage: driver.daily_message,
                    route: currentRoute,
                    buttons: <React.Fragment>
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

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Id.', field: 'driver_id', }, { label: 'Name', field: 'name' },
                { label: 'Email', field: 'email', }, { label: 'Cell', field: 'cell', },
                { label: 'Address', field: 'address', }, { label: 'Daily Message', field: 'dailyMessage', },
                { label: 'Route', field: 'route', }, { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (

            <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                    All Drivers
                </MDBCardHeader>
                <MDBCardBody className='p-2'>

                    <MDBDataTable id='driversTable' striped small hover theadColor="dark"
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
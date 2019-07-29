import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllDriverRoutes extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllDriverRoutes')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ driverRoutes: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllUsers')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                let users = json.data
                let drivers = users.filter(user => user.role_id === 3)
                if (this._isMounted) {
                    this.setState({ drivers: drivers })
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
            driverRoutes: [],
            drivers: [],
            routes: [],
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

    deleteDriverRoute = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('driverRouting').deleteRow(rowToBeDeleted)
        let driverRoute = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(driverRoute),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteDriverRoute', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { drivers, routes, driverRoutes } = this.state;
        var rows = [];
        var index = 0;

        driverRoutes.forEach((driverRoute) => {

            index = index + 1;
            let currentDriver;
            let currentRoute;
            if (drivers !== '' && drivers !== null && drivers !== undefined) {
                drivers.forEach(driver => {
                    if (driver.id.toString() === driverRoute.driver_id) {
                        currentDriver = driver.name
                    }
                });
            }
            if (routes !== '' && routes !== null && routes !== undefined) {
                routes.forEach(route => {
                    if (route.id.toString() === driverRoute.route_id) {
                        currentRoute = route.name
                    }
                });
            }
            rows.push(
                {
                    index: index,
                    driver: currentDriver,
                    route: currentRoute,
                    buttons: <React.Fragment>
                        <Can I='delete' a='driverRoute'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(driverRoute.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Driver', field: 'driver' },
                { label: 'Route', field: 'route', }, { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (

            <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                    Customers' Price-Groups
                </MDBCardHeader>
                <MDBCardBody className='p-2'>

                    <MDBDataTable id='driverRouting' striped small hover theadColor="dark"
                        bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                        data={data} theadTextWhite >
                    </MDBDataTable>
                    <DeleteModal
                        ref='deleteModal'
                        deleteEntry={this.deleteDriverRoute}
                    />
                </MDBCardBody>
            </MDBCard>
        );
    }

}

export default AllDriverRoutes
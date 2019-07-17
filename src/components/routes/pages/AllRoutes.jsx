import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import EditRouteModal from './sections/EditRouteModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllRoutes extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
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
            routes: [],
            rowToBeDeleted: '',
            dRowValue: '',
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }


    handleEdit = (id) => (e) => {
        this.refs.editRouteModal.setState({
            modalShow: true
        })
        this.refs.editRouteModal.fetchData(id);
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

    deleteRoute = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('routesTable').deleteRow(rowToBeDeleted)
        let route = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(route),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteRoute', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { routes } = this.state;
        var rows = [];
        var index = 0;

        routes.forEach((route) => {

            index = index + 1;
            rows.push(
                {
                    index: index,
                    name: route.name,
                    description: route.description,
                    buttons: <React.Fragment>
                        <Can I='update' a='route'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(route.id)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can>
                        <Can I='delete' a='route'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(route.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Name', field: 'name' },
                { label: 'Description', field: 'description', }, { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (

            <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                    All Routes
                </MDBCardHeader>
                <MDBCardBody className='p-2'>

                    <MDBDataTable id='routesTable' striped small hover theadColor="dark"
                        bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                        data={data} theadTextWhite >
                    </MDBDataTable>
                    <EditRouteModal
                        ref='editRouteModal'
                    />
                    <DeleteModal
                        ref='deleteModal'
                        deleteEntry={this.deleteRoute}
                    />
                </MDBCardBody>
            </MDBCard>
        );
    }

}

export default AllRoutes
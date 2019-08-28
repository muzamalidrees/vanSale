import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import EditInventoryModal from './sections/EditInventoryModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllInventory extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllDriverInventories')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ driverInventories: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllLocationInventories')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ locationInventories: json.data })
                }
            })
            .catch((error) => console.log(error))

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

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            driverInventories: [],
            locationInventories: [],
            users: [],
            roles: [],
            products: [],
            rowToBeDeleted: '',
            dRowValue: '',
            showWise: 'Driver',
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    toggle = () => {
        this.setState({
            showWise: this.state.showWise === 'Driver' ? 'Location' : 'Driver'
        })
    }

    handleEdit = (id, canA) => (e) => {
        this.refs.editInventoryModal.setState({
            modalShow: true,
        })
        this.refs.editInventoryModal.fetchData(id, canA);
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

    deleteInventory = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue

        let inventory = { value: dRowValue }
        var options = {
            method: 'DELETE',
            body: JSON.stringify(inventory),
            headers: { 'Content-Type': 'application/json' }
        }
        if (this.state.showWise === 'Driver') {
            document.getElementById('driverInventoriesTable').deleteRow(rowToBeDeleted)

            fetch('/deleteDriverInventory', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                })
                .catch((error) => console.log(error))
            window.location.reload()
        }
        else {
            document.getElementById('operatorInventoriesTable').deleteRow(rowToBeDeleted)
            fetch('/deleteLocationInventory', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                })
                .catch((error) => console.log(error))
            window.location.reload()
        }
    }



    render() {
        var { driverInventories, locationInventories, users, roles, products, showWise } = this.state;
        var rows = [];
        var index = 0;

        let driverRoleId, operatorRoleId;
        if (roles !== '' && roles !== null && roles !== undefined) {
            roles.forEach(role => {
                if (role.name === 'driver') {
                    driverRoleId = role.id
                }
                else if (role.name === 'operator') {
                    operatorRoleId = role.id
                }
            })
        }
        let drivers = users.filter(user => user.role_id === driverRoleId)
        let operators = users.filter(user => user.role_id === operatorRoleId)

        var inventories, inventoryPersons, personLabel, canA, tableId;
        if (showWise === 'Driver') {
            inventories = driverInventories
            inventoryPersons = drivers
            personLabel = 'Driver'
            canA = 'driverInventory'
            tableId = 'driverInventoriesTable'
        }
        else {
            inventories = locationInventories
            inventoryPersons = operators
            personLabel = 'Operator'
            canA = 'operatorInventory'
            tableId = 'operatorInventoriesTable'
        }


        inventories.forEach((inventory) => {
            index = index + 1;
            let currentPerson, currentProduct;
            if (inventoryPersons !== '' && inventoryPersons !== null && inventoryPersons !== undefined) {
                inventoryPersons.forEach(inventoryPerson => {
                    if (showWise === 'Driver') {
                        if (inventoryPerson.id === inventory.driver_id) {
                            currentPerson = inventoryPerson.name
                        }
                    }
                    else {
                        if (inventoryPerson.id === inventory.operator_id) {
                            currentPerson = inventoryPerson.name
                        }
                    }
                });
            }
            if (products !== '' && products !== null && products !== undefined) {
                products.forEach(product => {
                    if (product.id === inventory.product_id) {
                        currentProduct = product.name
                    }
                });
            }

            rows.push(
                {
                    index: index,
                    person: currentPerson,
                    product: currentProduct,
                    qty: inventory.qty,
                    buttons: <React.Fragment>
                        {/* <Can I='update' a={canA}>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(inventory.id, canA)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can> */}
                        <Can I='delete' a={canA}>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(inventory.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', },
                { label: `${personLabel}`, field: 'person', },
                { label: 'Product', field: 'Product' },
                { label: 'Qty.', field: 'qty' },
                { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }

        return (
            <Can I='read' a='driverInventories'>
                <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                    <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                        All {showWise}s Inventories
                </MDBCardHeader>
                    <MDBCardBody className='p-2'>
                        <Can I='read' a='operatorInventories'>
                            <MDBBtn size='sm' style={{ fontSize: '13px', letterSpacing: '3px' }} className='mx-0 px-2' color='info' onClick={this.toggle} >
                                {showWise === 'Driver' ? 'Location wise' : 'Driver wise'} Inventories
                            </MDBBtn>
                        </Can>
                        <MDBDataTable id={tableId} striped small hover theadColor="dark"
                            bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                            data={data} theadTextWhite >
                        </MDBDataTable>
                        <EditInventoryModal
                            ref='editInventoryModal'
                        />
                        <DeleteModal
                            ref='deleteModal'
                            deleteEntry={this.deleteInventory}
                        />
                    </MDBCardBody>
                </MDBCard >
            </Can>
        );
    }

}

export default AllInventory
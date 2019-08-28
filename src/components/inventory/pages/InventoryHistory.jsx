import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class InventoryHistory extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllInventoryHistories')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ allInventoryHistories: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllCustomers')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ customers: json.data })
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
            allInventoryHistories: [],
            customers: [],
            users: [],
            roles: [],
            products: [],
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

    deleteInventoryHistory = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue

        let inventory = { value: dRowValue }
        var options = {
            method: 'DELETE',
            body: JSON.stringify(inventory),
            headers: { 'Content-Type': 'application/json' }
        }
        document.getElementById('inventoryHistoriesTable').deleteRow(rowToBeDeleted)

        fetch('/deleteInventoryHistory', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
            })
            .catch((error) => console.log(error))
        window.location.reload()

    }



    render() {
        var { allInventoryHistories, customers, users, roles, products } = this.state;
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




        allInventoryHistories.forEach((history) => {
            index = index + 1;
            let currentCustomer, currentDriver, currentOperator, currentProduct;

            if (drivers !== '' && drivers !== null && drivers !== undefined) {
                drivers.forEach(driver => {
                    if (driver.id === history.driver_id) {
                        currentDriver = driver.name
                    }
                });
            }

            if (operators !== '' && operators !== null && operators !== undefined) {
                operators.forEach(operator => {
                    if (operator.id === history.operator_id) {
                        currentOperator = operator.name
                    }
                });
            }

            if (customers !== '' && customers !== null && customers !== undefined) {
                customers.forEach(customer => {
                    if (customer.id === history.customer_id) {
                        currentCustomer = customer.name
                    }
                });
            }

            if (products !== '' && products !== null && products !== undefined) {
                products.forEach(product => {
                    if (product.id === history.product_id) {
                        currentProduct = product.name
                    }
                });
            }

            rows.push(
                {
                    index: index,
                    customer: currentCustomer,
                    driver: currentDriver,
                    operator: currentOperator,
                    product: currentProduct,
                    qty: history.qty,
                    flag: history.flag,
                    buttons: <React.Fragment>
                        {/* <Can I='update' a={canA}>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(inventory.id, canA)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can> */}
                        <Can I='delete' a='inventoryHistory'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(history.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', },
                { label: 'Customer', field: 'customer', },
                { label: 'Driver', field: 'driver', },
                { label: 'Operator', field: 'operator', },
                { label: 'Product', field: 'Product' },
                { label: 'Qty.', field: 'qty' },
                { label: 'Direction', field: 'flag' },
                { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }

        return (
            <Can I='read' a='inventoryHistories'>
                <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                    <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                        Inventory Histories
                </MDBCardHeader>
                    <MDBCardBody className='p-2'>

                        <MDBDataTable id='inventoryHistoriesTable' striped small hover theadColor="dark"
                            bordered btn entries={55} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                            data={data} theadTextWhite >
                        </MDBDataTable>
                        <b> FTO :</b> factory to operator&nbsp;&nbsp;&nbsp;&nbsp;
                    <b> OTD :</b> operator to driver&nbsp;&nbsp;&nbsp;&nbsp;
                    <b> R.DTO :</b> Return driver to operator&nbsp;&nbsp;&nbsp;&nbsp;
                    <b> R.OTF :</b> Return operator to factory&nbsp;&nbsp;&nbsp;&nbsp;
                    <b> R.New :</b> new return customer to driver&nbsp;&nbsp;&nbsp;&nbsp;
                    <b> R.Update :</b> customer's return update&nbsp;&nbsp;&nbsp;&nbsp;
                    <b> R.Delete :</b> customer's return deleted&nbsp;&nbsp;&nbsp;&nbsp;
                    <b> S.New :</b> new sale driver to customer&nbsp;&nbsp;&nbsp;&nbsp;
                    <b> S.Update :</b> driver's sale update&nbsp;&nbsp;&nbsp;&nbsp;
                    <b> S.Delete :</b> driver's sale deleted
                    <DeleteModal
                            ref='deleteModal'
                            deleteEntry={this.deleteInventoryHistory}
                        />
                    </MDBCardBody>
                </MDBCard >
            </Can>
        );
    }

}

export default InventoryHistory
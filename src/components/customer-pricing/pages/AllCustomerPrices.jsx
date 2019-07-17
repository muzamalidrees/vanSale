import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllCustomerPrices extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllCustomerPrices')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ customerPrices: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllCustomers')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ customers: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllPriceGroups')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ priceGroups: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            customerPrices: [],
            customers: [],
            priceGroups: [],
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

    deleteCustomerPriceGroup = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('customerPricingTable').deleteRow(rowToBeDeleted)
        let customerPriceGroup = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(customerPriceGroup),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteCustomerPriceGroup', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { customers, priceGroups, customerPrices } = this.state;
        var rows = [];
        var index = 0;

        customerPrices.forEach((customerPrice) => {

            index = index + 1;
            let currentCustomer;
            let currentPriceGroup;
            if (customers !== '' && customers !== null && customers !== undefined) {
                customers.forEach(customer => {
                    if (customer.id.toString() === customerPrice.customer_id) {
                        currentCustomer = customer.name
                    }
                });
            }
            if (priceGroups !== '' && priceGroups !== null && priceGroups !== undefined) {
                priceGroups.forEach(priceGroup => {
                    if (priceGroup.id.toString() === customerPrice.price_group_id) {
                        currentPriceGroup = priceGroup.name
                    }
                });
            }
            rows.push(
                {
                    index: index,
                    customer: currentCustomer,
                    priceGroup: currentPriceGroup,
                    buttons: <React.Fragment>
                        <Can I='delete' a='customerPrice'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(customerPrice.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Customer', field: 'customer' },
                { label: 'Price-Group', field: 'priceGroup', }, { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (

            <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                    Customers' Price-Groups
                </MDBCardHeader>
                <MDBCardBody className='p-2'>

                    <MDBDataTable id='customerPricingTable' striped small hover theadColor="dark"
                        bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                        data={data} theadTextWhite >
                    </MDBDataTable>
                    <DeleteModal
                        ref='deleteModal'
                        deleteEntry={this.deleteCustomerPriceGroup}
                    />
                </MDBCardBody>
            </MDBCard>
        );
    }

}

export default AllCustomerPrices
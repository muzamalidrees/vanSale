import React, { Component } from 'react';
import { MDBInput, MDBBtn, MDBRow, MDBCol, } from 'mdbreact';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { Can } from '../../../configs/Ability-context'
import Notification from './Notification'



class InvoiceDetails extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this._isMounted = true
        fetch('/getAllCustomers')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ customers: json.data })
                }
            })
            .catch((error) => console.log(error))


        this.state = {
            trDate: new Date(),
            customer: '',
            customers: [],
            total: 0,
            invoiceId: 1,
            notificationMessage: '',
            notificationShow: false
        }
    }

    handleDateChange = (value) => {
        this.setState({
            trDate: value
        });
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = selectedOption => {
        if (selectedOption !== null) {
            this.setState({
                notificationMessage: selectedOption.message,
                notificationShow: true
            })
            setTimeout(() => this.setState({ notificationShow: false }), 15002);
        }
        else {
            this.setState({
                notificationShow: false
            })
        }
        this.setState({
            customer: selectedOption
        })
        this.props.customerSelected(selectedOption)
    }

    minusTotalValue = (value) => {

        this.setState({
            total: this.state.total - parseInt(value)
        })
    }

    addTotalValue = (value) => {

        this.setState({
            total: this.state.total + parseInt(value)
        })
    }

    componentDidMount() {
        this.fetchLastInvoiceId();
    }

    fetchLastInvoiceId = () => {
        let currentComponent = this;
        this._isMounted = true
        fetch('/getLastInvoiceID')
            .then((res) => res.json())
            .then(function (json) {
                // console.log(json)
                if (json.data && json.data.length !== 0 && currentComponent._isMounted) {
                    let lastInvoiceID = json.data.shift();
                    let id = lastInvoiceID.id;
                    let invoiceId = id + 1
                    currentComponent.setState({ invoiceId: invoiceId })
                    currentComponent.props.lastInvoiceIdFetched(invoiceId)
                }
            })
            .catch((error) => console.log(error));
    }

    saveInvoice = () => {
        let { trDate, total, customer } = this.state

        let invoice = {
            trDate: trDate, total: total, customerId: customer.value,
            // driverId: 7
            driverId: Number(localStorage.getItem('ui'))
        }

        var options = {
            method: 'POST',
            body: JSON.stringify(invoice),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/addNewInvoice', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
            })
            .catch((error) => console.log(error))

        this.setState({
            trDate: new Date(),
            customer: '',
            total: 0
        })
    }


    render() {
        var { trDate, customer, customers, total } = this.state
        const customerStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : customer !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
            })
        }


        var customerOptions;
        if (customers !== '' && customers !== null && customers !== undefined) {
            customerOptions = customers.map(customer => ({
                key: customer.id, label: customer.name, value: customer.id, message: customer.driver_message,
                invoiceMessage: customer.invoice_message, shop: customer.shop_name, cell: customer.cell, address: customer.address
            }));
        }



        return (

            <MDBRow className='m-0 p-0' center>
                <MDBCol lg='2' className='mb-3' middle >
                    <DatePicker
                        selected={trDate}
                        placeholderText='Date'
                        onChange={this.handleDateChange}
                        className='form-control'
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yy"
                        autoComplete='off'
                        required
                    />
                </MDBCol>
                <MDBCol lg='3' className='mb-3' middle >
                    <Select
                        styles={customerStyles}
                        value={customer}
                        onChange={this.handleSelectChange}
                        options={customerOptions}
                        placeholder='Customer'
                        isSearchable
                        isClearable
                        className='form-control-md'
                        ref='customerSelect'
                    >
                    </Select>
                    {
                        this.state.notificationShow ?
                            <Notification
                                message={this.state.notificationMessage}
                                icon={"envelope"}
                            /> : null
                    }
                </MDBCol>
                <MDBCol lg='2' className='mb-3' >
                    <MDBInput
                        type='number'
                        value={total}
                        label='Total'
                        name='total'
                        className='font-weight-bold'
                        disabled
                    />
                </MDBCol>
            </MDBRow>

        )
    }
}


export default InvoiceDetails
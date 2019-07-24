import React, { Component } from 'react';
import { MDBInput, MDBBtn, MDBRow, MDBCol, } from 'mdbreact';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { Can } from '../../../configs/Ability-context'



class InvoiceDetails extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this._isMounted = true
        fetch('/getAllCustomers')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ customers: json.data })
                }
            })
            .catch((error) => console.log(error))

        // fetch('/getAllDrivers')
        //     .then((res) => res.json())
        //     .then((json) => {
        //         console.log(json)
        //         if (this._isMounted) {
        //             this.setState({ drivers: json.data })
        //         }
        //     })
        //     .catch((error) => console.log(error))

        this.state = {
            trDate: '',
            customer: '',
            customers: [],
            // driver: '',
            // drivers: [],
            showOptions: false,
            total: 0,
            invoiceId: 1
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

        this.setState({
            selectedOption
        })
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
                console.log(json)
                if (json.data.length !== 0 && this._isMounted) {
                    let lastInvoiceID = json.data.shift();
                    let id = lastInvoiceID.id;
                    currentComponent.setState({ invoiceId: id + 1 })
                }
            })
            .catch((error) => console.log(error));
    }

    saveInvoice = () => {
        this.setState({
            trDate: '', customer: '', total: 0
        })
        let { trDate, total, customer } = this.state

        let invoice = { date: trDate, total: total, customerId: customer.value, driverId: driverId }
        var options = {
            method: 'POST',
            body: JSON.stringify(invoice),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/addNewInvoice', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }


    render() {
        var { invoiceId, trDate, customer, customers,
            driver, drivers, showOptions, total } = this.state
        const customerStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : customer !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
            })
        }
        // const driverStyles = {
        //     control: (base, state) => ({
        //         ...base,
        //         borderColor: state.isFocused ?
        //             '#ddd' : driver !== null ?
        //                 '#ddd' : 'red',
        //         fontWeight: 370,
        //     })
        // }

        var customerOptions;
        // var driverOptions;
        if (showOptions) {

            customerOptions = customers.map(customer => ({
                key: customer.id, label: customer.name, value: customer.id
            }));
            // driverOptions = drivers.map(driver => ({
            //     key: driver.id, label: driver.name, value: driver.id
            // }));
        }



        return (

            <MDBRow className='m-0 p-0' center>
                <MDBCol lg='2' className='mb-3' middle >
                    <DatePicker
                        id='datePicker'
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
                    {/* <MDBInput style={{ display: 'none' }} value={invoiceId} className='m-0' disabled /> */}
                </MDBCol>
                {/* <Can I='am' a='driver'> */}
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
                </MDBCol>
                {/* <Can I='am' a='operator'>
                    <MDBCol lg='3' className='mb-3' middle >
                        <Select
                            styles={driverStyles}
                            value={driver}
                            onChange={this.handleSelectChange}
                            options={driverOptions}
                            placeholder='Driver'
                            isSearchable
                            isClearable
                            className='form-control-md'
                            ref='driverSelect'
                        >
                        </Select>
                    </MDBCol>
                </Can> */}
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
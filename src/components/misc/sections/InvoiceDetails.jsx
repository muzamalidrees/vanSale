import React, { Component } from 'react';
import { MDBInput, MDBRow, MDBCol, MDBAnimation } from 'mdbreact';
import Select from 'react-select';
import DatePicker from "react-datepicker";
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

        fetch('/getAllDriverRoutes')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ driverRoutes: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllCustomerRoutes')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ customerRoutes: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            trDate: new Date(),
            customer: '',
            customers: [],
            driverRoutes: [],
            customerRoutes: [],
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
        if (this._isMounted) {
            if (selectedOption !== null) {
                this._isMounted && this.setState({
                    notificationMessage: selectedOption.message,
                    notificationShow: true
                })
                setTimeout(() => this._isMounted && this.setState({ notificationShow: false }), 15002);
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
    }

    minusTotalValue = (value) => {
        if (this._isMounted) {
            this.setState({
                total: this.state.total - parseInt(value)
            })
        }
    }

    addTotalValue = (value) => {
        if (this._isMounted) {
            this.setState({
                total: this.state.total + parseInt(value)
            })
        }
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
        // console.log(trDate, total, customer);

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
        if (this._isMounted) {
            this.setState({
                trDate: new Date(),
                customer: '',
                total: 0,
                notificationMessage: '',
                notificationShow: false
            })
        }
    }


    render() {
        var { trDate, customer, customers, driverRoutes, customerRoutes, total } = this.state
        const customerStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : customer !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
            })
        }

        let Customers = [], thisDriverCustomers = []
        if (customers.length !== 0 && driverRoutes.length !== 0 && customerRoutes.length !== 0) {
            let driverId = localStorage.getItem('ui')
            let thisDriverRoutes = driverRoutes.filter(driverRoute => driverRoute.driver_id === Number(driverId))

            thisDriverRoutes.forEach(driverRoute => {
                customerRoutes.forEach(customerRoute => {
                    if (customerRoute.route_id === driverRoute.route_id) {
                        thisDriverCustomers.push(customerRoute)
                    }
                })
            })

            thisDriverCustomers.forEach(driverCustomer => {
                customers.forEach(customer => {
                    if (customer.id === driverCustomer.customer_id) {
                        Customers.push(customer)
                    }
                })
            })
            // console.log(thisDriverRoutes);
            // console.log(thisDriverCustomers);
            // console.log(customers);
        }

        var customerOptions;
        if (Customers.length !== 0 && Customers !== null && Customers !== undefined) {
            customerOptions = Customers.map(Customer => ({
                key: Customer.id, label: Customer.name, value: Customer.id, message: Customer.driver_message,
                invoiceMessage: Customer.invoice_message, shop: Customer.shop_name, cell: Customer.cell, address: Customer.address
            }));
        }



        return (

            <MDBRow className='m-0 p-0' center>
                <MDBCol lg='2' className='' middle >
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
                <MDBCol lg='3' className='' middle >
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
                        this.state.notificationShow
                            ?
                            <MDBAnimation type="fadeInUp" >
                                <Notification
                                    message={this.state.notificationMessage}
                                    icon={"envelope"}
                                />
                            </MDBAnimation>
                            :
                            null
                    }
                </MDBCol>
                <MDBCol lg='2' className='' >
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
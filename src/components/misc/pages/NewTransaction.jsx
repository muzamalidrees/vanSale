import React, { Component } from 'react';
import { MDBInput, MDBBtn, MDBRow, MDBCol, MDBContainer, MDBCard, MDBCardBody, MDBCardHeader } from 'mdbreact';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { Can } from '../../../configs/Ability-context'



class NewTransaction extends Component {
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

        fetch('/getAllDrivers')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ drivers: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data, showOptions: true })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            trDate: '',
            invoiceId: 1,
            rate: '',
            qty: '',
            customer: '',
            customers: [],
            product: '',
            products: [],
            driver: '',
            drivers: [],
            showOptions: false,
            total: 0,

        }
        this.handleProductSubmit = this.handleProductSubmit.bind(this)
    }

    handleDateChange = (value) => {
        this.setState({
            trDate: value
        });
    }

    componentWillUnmount() {
        this._isMounted = false
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

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = selectedOption => {

        this.setState({
            selectedOption
        })
    }

    onKeyPress = (e) => {
        if ((e.which) === 101 || (e.which) === 45) e.preventDefault();
    }

    handleProductSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.productDetailsForm;
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        // else if (this.state.product === '' || this.state.product === null) {
        //     this.setState({ product: null })
        //     return
        // }
        // else if (this.refs.customerSelect === undefined) {
        //     if (this.state.driver === '' || this.state.driver === null) {
        //         this.setState({ driver: null })
        //         return
        //     }
        // }
        // else if (this.state.customer === '' || this.state.customer === null) {
        //     this.setState({ customer: null })
        //     return
        // }
        else {
            let pId = this.state.product.value;
            let pName = this.state.product.label;
            let pRate = this.state.rate;
            let pQTY = this.state.qty
            let pPrice = this.price.value;
            let trDate = this.state.trDate
            let tableId = this.props.tableId
            // console.log(pId, pRate, pQTY, pPrice, trDate);

            this.addTotalValue(pPrice);
            this.props.addProductToTbl(tableId, pId, pName, pRate, pQTY, pPrice, trDate);
            document.getElementById(`${this.props.containerId}`).style.display = '';
            this.setState({
                product: '',
                rate: '',
                qty: '',
                trDate: '',
            })
        }
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





    render() {
        var { invoiceId, trDate, rate, qty, customer, customers, product,
            products, driver, drivers, showOptions, total } = this.state
        const customerStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : customer !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
            })
        }
        const driverStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : driver !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
            })
        }
        const productStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : product !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
            })
        }
        var productOptions;
        var customerOptions;
        var driverOptions;
        if (showOptions) {

            productOptions = products.map(product => ({
                key: product.id, label: product.name, value: product.id
            }));
            customerOptions = customers.map(customer => ({
                key: customer.id, label: customer.name, value: customer.id
            }));
            driverOptions = drivers.map(driver => ({
                key: driver.id, label: driver.name, value: driver.id
            }));
        }



        return (
            <MDBContainer className='' fluid style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol>
                        <MDBCard className=' p-2'>
                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                New {this.props.tableId === 'saleProductstable' ? 'Sales' : 'Returns'}
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>
                                <form ref='productDetailsForm' onSubmit={this.handleProductSubmit} noValidate >
                                    <fieldset className='legend-border'>
                                        <legend className='legend-border'></legend>
                                        <MDBRow className='mt-4 p-0' >
                                            <MDBCol md='2' className='mb-3' middle >
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
                                            <MDBCol md='3' className='mb-3' middle >
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
                                            {/* </Can> */}
                                            {/* <Can I='am' a='operator'> */}
                                            <MDBCol md='3' className='mb-3' middle >
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
                                            {/* </Can> */}
                                        </MDBRow>
                                        <MDBRow className=' p-0'>
                                            <MDBCol md='3' className='' middle >
                                                <Select
                                                    styles={productStyles}
                                                    value={product}
                                                    onChange={this.handleSelectChange}
                                                    options={productOptions}
                                                    placeholder='Product'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-md'
                                                >
                                                </Select>
                                            </MDBCol>
                                            <MDBCol size='lg' className=''>
                                                <MDBInput
                                                    type='number'
                                                    value={rate}
                                                    label='Rate'
                                                    name='rate'
                                                    onInput={this.handleInput}
                                                    outline required
                                                    onKeyPress={this.onKeyPress}
                                                />

                                            </MDBCol>
                                            <MDBCol size='lg' className=''   >
                                                <MDBInput
                                                    type='number'
                                                    value={qty}
                                                    label='Qty.'
                                                    name='qty'
                                                    onInput={this.handleInput}
                                                    outline required
                                                    onKeyPress={this.onKeyPress}
                                                />

                                            </MDBCol>
                                            <MDBCol size='lg' className=''>
                                                <MDBInput
                                                    type='number'
                                                    value={rate * qty}
                                                    inputRef={el => this.price = el}
                                                    label='Price'
                                                    outline
                                                    disabled
                                                />
                                            </MDBCol>
                                            <MDBCol size='lg' middle className=' text-center'>
                                                <MDBBtn
                                                    size='sm'
                                                    color="dark"
                                                    className='font-weight-bold'
                                                    style={{ fontSize: '12px', borderRadius: '5px' }}
                                                    type='submit'
                                                    outline
                                                    >
                                                    Add Product
                                                    </MDBBtn>
                                            </MDBCol>
                                            <MDBCol md='2'>
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
                                    </fieldset>
                                </form >
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}


export default NewTransaction
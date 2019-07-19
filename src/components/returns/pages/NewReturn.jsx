import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBIcon, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'


class NewReturn extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllRoutes')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ routes: json.data, showOptions: true })
                }
            })
            .catch((error) => console.log(error))



        this.state = {
            name: '',
            email: '',
            cell: '',
            address: '',
            shopName: '',
            postCode: '',
            customer_id: '',
            route: '',
            driverMessage: '',
            invoiceMessage: '',
            routes: '',
            showOptions: false,
            notificationMessage: '',
            notificationShow: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = selectedOption => {
        this.setState({
            route: selectedOption
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.newCustomerForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.route === '' || this.state.route === null) {
            this.setState({ route: null })
            return
        }
        else {
            let name = this.state.name
            let email = this.state.email
            let cell = this.state.cell
            let address = this.state.address
            let shopName = this.state.shopName
            let postCode = this.state.postCode
            let route_id = this.state.route.value
            let customer_id = this.state.customer_id
            let driverMessage = this.state.driverMessage
            let invoiceMessage = this.state.invoiceMessage

            console.log(name, email, cell, address, shopName, route_id, postCode, customer_id, driverMessage, invoiceMessage);
            let customer = {
                name: name, email: email, cell: cell, address: address, shopName: shopName, postCode: postCode,
                route_id: route_id, customer_id: customer_id, driverMessage: driverMessage, invoiceMessage: invoiceMessage
            }

            var options = {
                method: 'POST',
                body: JSON.stringify(customer),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewCustomer', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ message: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            route_id: '',
                            name: '',
                            email: '',
                            cell: '',
                            address: '',
                            shopName: '',
                            postCode: '',
                            customer_id: '',
                            driverMessage: '',
                            invoiceMessage: '',
                        })
                    }
                    else {
                        this.customer_id.focus();
                    }
                    if (this._isMounted === true) {
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);

                    }
                })
                .catch((error) => console.log(error))
        }
    }

    render() {

        const { route, routes, showOptions } = this.state
        const customStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : route !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none'
            })
        }
        var routeOptions;
        if (showOptions) {

            routeOptions = routes.map(route => ({ key: route.id, label: route.name, value: route.id }));
        }


        return (
            // <Can I='create' a='customer'>
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol>
                        <MDBCard className=' py-2'>
                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className=" p-2 text-center font-weight-bold">
                                New Customer
                            </MDBCardHeader>
                            <MDBCardBody className='p-3'>

                                <form ref='newCustomerForm' onSubmit={this.handleSubmit} noValidate>
                                    <MDBRow around className="grey-text">
                                        <MDBCol md="5">
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.name}
                                                label="Name"
                                                name='name'
                                                icon="user"
                                                group
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.email}
                                                label="Email"
                                                name="email"
                                                icon="envelope"
                                                group
                                                type="email"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.cell}
                                                label="Phone"
                                                name="cell"
                                                icon="phone"
                                                group
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.address}
                                                label="Address"
                                                name="address"
                                                icon="map-marker-alt"
                                                group
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.shopName}
                                                label="Shop Name"
                                                name="shopName"
                                                icon="pen-fancy"
                                                group
                                                type="text"
                                                validate
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.postCode}
                                                label="Post Code"
                                                name="postCode"
                                                icon="envelope-open"
                                                group
                                                type="text"
                                                validate
                                                required
                                            />
                                        </MDBCol>
                                        <MDBCol md="5">
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.customer_id}
                                                label="Id."
                                                name="customer_id"
                                                icon="id-card"
                                                inputRef={el => { this.customer_id = el }}
                                                group
                                                type="text"
                                                validate
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.driverMessage}
                                                label="Driver's Message"
                                                name="driverMessage"
                                                icon="comment"
                                                group
                                                type="textarea"
                                                rows='1'
                                                validate
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.invoiceMessage}
                                                label="Invoice Message"
                                                name="invoiceMessage"
                                                icon="file-invoice"
                                                group
                                                type="textarea"
                                                rows='1'
                                                validate
                                            />
                                            <MDBRow className='mb-5'>
                                                <MDBCol sm='1' className=''>
                                                    <MDBIcon icon="route" size='2x' />
                                                </MDBCol>
                                                <MDBCol className=''>
                                                    {/* {showOptions ? */}
                                                    <Select
                                                        styles={customStyles}
                                                        value={route}
                                                        onChange={this.handleSelectChange}
                                                        options={routeOptions}
                                                        placeholder='Route'
                                                        isSearchable
                                                        isClearable
                                                        className='form-control-md pl-0'
                                                    >
                                                    </Select>
                                                    {/* : null */}
                                                    {/* } */}
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBBtn className='form-control py-0 font-weight-bold mt-4' size='lg' color="dark" outline type='submit'>Register</MDBBtn>
                                        </MDBCol>
                                    </MDBRow>
                                </form>
                            </MDBCardBody>
                        </MDBCard>
                        {
                            this.state.notificationShow ?
                                <Notification
                                    message={this.state.notificationMessage}
                                /> : null
                        }
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            // </Can>
        );
    }
}


export default NewReturn
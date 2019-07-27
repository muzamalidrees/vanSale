import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBRow, MDBCol, MDBIcon, MDBModalBody, MDBCard, MDBCardBody, MDBModalHeader, MDBInput } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../../misc/sections/Notification';


class EditCustomerModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            customerId: '',
            route_id: '',
            route: '',
            name: '',
            email: '',
            cell: '',
            address: '',
            shopName: '',
            postCode: '',
            customer_id: '',
            driverMessage: '',
            invoiceMessage: '',
            routes: '',
            routeOptions: [],
            notificationMessage: '',
            notificationShow: false
        }
    }
    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificCustomer/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                var customer = json.data
                if (this._isMounted === true) {
                    this.setState({
                        customer: customer,
                        customerId: customer.id,
                        route_id: customer.route_id,
                        name: customer.name,
                        email: customer.email,
                        cell: customer.cell,
                        address: customer.address,
                        shopName: customer.shop_name,
                        postCode: customer.post_code,
                        customer_id: customer.customer_id,
                        driverMessage: customer.driver_message,
                        invoiceMessage: customer.invoice_message,
                    })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllRoutes')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ routes: json.data })
                }
                this.setRouteOptions(json.data);
            })
            .catch((error) => console.log(error))

    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,

        });
    }

    setRouteOptions = (routes) => {
        let routeOptions = routes.map(route => ({ key: route.id, label: route.name, value: route.id }));
        let currentRoute;
        routes.forEach(route => {
            if (route.id.toString() === this.state.route_id) {
                currentRoute = { label: route.name, value: route.id }
            }
        });
        this.setState({
            routeOptions: routeOptions, route: currentRoute,
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = selectedOption => {
        this.setState({
            route: selectedOption
        })

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.updateCustomerForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.route === '' || this.state.route === null) {
            this.setState({ route: null })
            return
        }
        else {
            let { customerId, name, email, cell, address, shopName, postCode, customer_id,
                driverMessage, invoiceMessage, route_id } = this.state

            console.log(customerId, name, email, cell, address, shopName, postCode, customer_id, driverMessage, invoiceMessage, route_id);

            let customer = {
                id: customerId, name: name, email: email, cell: cell, address: address, shopName: shopName,
                postCode: postCode, customer_id: customer_id, driverMessage: driverMessage,
                invoiceMessage: invoiceMessage, route_id: route_id
            }

            var options = {
                method: 'PUT',
                body: JSON.stringify(customer),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/updateCustomer', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);
                    }

                })
                .catch((error) => console.log(error))
            //closing edit modal

            this.toggle()

            // refreshing all records table
            window.location.reload();
        }
    }





    render() {
        const { route, routeOptions } = this.state
        const customStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : route !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderRadius:'0px',
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
            })
        }


        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' centered>
                    <MDBModalHeader toggle={this.toggle}>
                        Edit Customer Details
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBCard className=' py-5'>
                            <MDBCardBody className='p-5'>
                                <form ref='updateCustomerForm' onSubmit={this.handleSubmit} noValidate>
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
                                                inputRef={el => { this.shopName = el }}
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
                                        <MDBCol md="5" middle>
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.customer_id}
                                                label="Id."
                                                name="customer_id"
                                                icon="id-card"
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
                                                type="text"
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
                                                rows='2'
                                                validate
                                            />
                                            <MDBRow className='mb-5'>
                                                <MDBCol sm='2' className=''>
                                                    <MDBIcon icon="route" size='2x' />
                                                </MDBCol>
                                                <MDBCol sm='10'>
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
                                            <MDBRow around>
                                                <MDBBtn size='sm' className=' mt-4 font-weight-bold' color="dark" onClick={this.toggle}>Close</MDBBtn>
                                                <MDBBtn size='sm' className=' mt-4 font-weight-bold' onClick={this.handleSubmit} outline color="dark">Save updates</MDBBtn>
                                            </MDBRow>
                                        </MDBCol>
                                    </MDBRow>
                                </form>
                            </MDBCardBody>
                            {
                                this.state.notificationShow ?
                                    <Notification
                                        message={this.state.notificationMessage}
                                    />
                                    : null
                            }
                        </MDBCard>
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default EditCustomerModal;
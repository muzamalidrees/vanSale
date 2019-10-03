import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBAnimation, MDBBtn, MDBInput, MDBIcon, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'
import chroma from 'chroma-js';
import makeAnimated from 'react-select/animated';
import LoaderModal from '../../misc/sections/LoaderModal'



class NewCustomer extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        let paths = ['/getAllRoutes', '/getAllPriceGroups'],
            dataRequests = paths.map(path => fetch(path))
        Promise.all(dataRequests)
            .then(responses => {
                Promise.all(responses.map(res => res.json()))
                    .then(jsons => {
                        // console.log(jsons[0]);
                        // console.log(jsons[1]);
                        if (this._isMounted) {
                            this.setState({
                                allRoutes: jsons[0].data,
                                allPriceGroups: jsons[1].data
                            })
                        }
                    })
            })

        this.state = {
            name: '',
            email: '',
            cell: '',
            address: '',
            shopName: '',
            postCode: '',
            customer_id: '',
            route: [],
            priceGroup: [],
            driverMessage: '',
            invoiceMessage: '',
            allRoutes: [],
            allPriceGroups: [],
            notificationMessage: '',
            notificationShow: false,
            loaderShow: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = name => selectedOption => {
        this.setState({
            [name]: selectedOption
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
        else if (this.state.route.length === 0 || this.state.route === null) {
            this.setState({ route: null })
            return
        }
        else if (this.state.priceGroup.length === 0 || this.state.priceGroup === null) {
            this.setState({ priceGroup: null })
            return
        }
        else {
            this.setState({ loaderShow: true })
            let { name, email, cell, address, shopName, postCode, customer_id, driverMessage, invoiceMessage, route, priceGroup } = this.state

            // console.log(name, email, cell, address, shopName, postCode, customer_id, driverMessage, invoiceMessage);
            let customer = {
                name: name, email: email, cell: cell, address: address, shopName: shopName, postCode: postCode,
                customer_id: customer_id, driverMessage: driverMessage, invoiceMessage: invoiceMessage
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
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                    }
                    if (json.success === true) {
                        let customer = json.data,
                            customerId = customer.id,
                            Routes = [], Prices = []

                        route.forEach(Route => {
                            let routeId = Route.value
                            Routes.push({ route_id: routeId, customer_id: customerId })
                        })
                        priceGroup.forEach(PriceGroup => {
                            let priceGroupId = PriceGroup.value
                            Prices.push({ price_group_id: priceGroupId, customer_id: customerId })
                        })

                        let customerRoutes = { Routes: Routes }, customerPrices = { Prices: Prices },
                            customerRouteOptions = {
                                method: 'POST',
                                body: JSON.stringify(customerRoutes),
                                headers: { 'Content-Type': 'application/json' }
                            },
                            customerPriceOptions = {
                                method: 'POST',
                                body: JSON.stringify(customerPrices),
                                headers: { 'Content-Type': 'application/json' }
                            },
                            calls = [{ path: '/addNewCustomerRoutes', options: customerRouteOptions }, { path: '/addNewCustomerPrices', options: customerPriceOptions }],
                            dataRequests = calls.map(call => fetch(call.path, call.options))
                        Promise.all(dataRequests).then(responses => {
                            Promise.all(responses.map(res => res.json())).then(jsons => {
                                // console.log(jsons[0]);
                                // console.log(jsons[1]);
                                if (this._isMounted) {
                                    this.setState({
                                        name: '',
                                        email: '',
                                        cell: '',
                                        address: '',
                                        shopName: '',
                                        postCode: '',
                                        customer_id: '',
                                        driverMessage: '',
                                        invoiceMessage: '',
                                        route: [],
                                        priceGroup: [],
                                        loaderShow: false
                                    })
                                }
                            })
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
        const { route, allRoutes, priceGroup, allPriceGroups, loaderShow } = this.state

        const animatedComponents = makeAnimated();
        const routeStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : route !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                fontSize: '16px',
                backgroundColor: 'white',
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                const color = chroma(data.color);
                return {
                    ...styles,
                    backgroundColor: isDisabled
                        ? null
                        : isSelected
                            ? data.color
                            : isFocused
                                ? color.alpha(0.1).css()
                                : null,
                    color: isDisabled
                        ? '#ccc'
                        : isSelected
                            ? chroma.contrast(color, 'white') > 2
                                ? 'white'
                                : 'black'
                            : data.color,
                    cursor: isDisabled ? 'not-allowed' : 'default',

                    ':active': {
                        ...styles[':active'],
                        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                    },
                };
            },
            multiValue: (styles, { data }) => {
                const color = chroma(data.color);
                return {
                    ...styles,
                    backgroundColor: color.alpha(0.1).css(),
                };
            },
            multiValueLabel: (styles, { data }) => ({
                ...styles,
                color: data.color,
            }),
            multiValueRemove: (styles, { data }) => ({
                ...styles,
                color: data.color,
                ':hover': {
                    backgroundColor: data.color,
                    color: 'white',
                },
            }),
        }

        let routeOptions = allRoutes ? allRoutes.map(route => ({
            key: route.id,
            label: route.name,
            value: route.id,
            color: route.id % 2 === 0 ?
                '#3366cc' : '#006652'
        })) : []

        const priceGroupStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : priceGroup !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                fontSize: '16px',
                backgroundColor: 'white',
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                const color = chroma(data.color);
                return {
                    ...styles,
                    backgroundColor: isDisabled
                        ? null
                        : isSelected
                            ? data.color
                            : isFocused
                                ? color.alpha(0.1).css()
                                : null,
                    color: isDisabled
                        ? '#ccc'
                        : isSelected
                            ? chroma.contrast(color, 'white') > 2
                                ? 'white'
                                : 'black'
                            : data.color,
                    cursor: isDisabled ? 'not-allowed' : 'default',

                    ':active': {
                        ...styles[':active'],
                        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                    },
                };
            },
            multiValue: (styles, { data }) => {
                const color = chroma(data.color);
                return {
                    ...styles,
                    backgroundColor: color.alpha(0.1).css(),
                };
            },
            multiValueLabel: (styles, { data }) => ({
                ...styles,
                color: data.color,
            }),
            multiValueRemove: (styles, { data }) => ({
                ...styles,
                color: data.color,
                ':hover': {
                    backgroundColor: data.color,
                    color: 'white',
                },
            }),
        }

        let priceGroupOptions = allPriceGroups ? allPriceGroups.map(PriceGroup => ({
            key: PriceGroup.id,
            label: PriceGroup.name,
            value: PriceGroup.id,
            color: PriceGroup.id % 2 === 0 ?
                '#3366cc' : '#006652'
        })) : []



        return (
            <Can I='create' a='customer' >
                <MDBContainer fluid style={{ marginTop: '70px' }}>
                    <MDBRow center>
                        <MDBCol md='7'>
                            <MDBCard className=' py-4'>
                                <MDBCardHeader tag="h4" style={{ color: 'dark' }} className=" p-2 text-center font-weight-bold">
                                    New Customer
                                </MDBCardHeader>
                                <MDBCardBody className='p-3'>

                                    <form ref='newCustomerForm' onSubmit={this.handleSubmit} noValidate>
                                        <MDBRow around className="grey-text p-0 m-0">
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
                                                <MDBRow className='mb-5'>
                                                    <MDBCol sm='1' middle className=''>
                                                        <MDBIcon icon="route" size='2x' />
                                                    </MDBCol>
                                                    <MDBCol className='text-center'>
                                                        <label ref='label' style={{ fontFamily: 'monospace', color: '#6600cc' }}>{route ? route.length : 0} routes selected</label>
                                                        <Select
                                                            isMulti
                                                            styles={routeStyles}
                                                            value={route}
                                                            onChange={this.handleSelectChange('route')}
                                                            options={routeOptions}
                                                            placeholder='Routes..'
                                                            isSearchable
                                                            isClearable
                                                            className='form-control-md pl-0'
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={false}
                                                        />
                                                    </MDBCol>
                                                </MDBRow>
                                            </MDBCol>
                                            <MDBCol md="5">
                                                <MDBInput
                                                    onInput={this.handleInput}
                                                    value={this.state.postCode}
                                                    label="Post Code"
                                                    name="postCode"
                                                    icon="envelope-open"
                                                    group
                                                    className='mb-5'
                                                    type="text"
                                                    required
                                                />
                                                <MDBInput
                                                    onInput={this.handleInput}
                                                    value={this.state.customer_id}
                                                    label="Id."
                                                    name="customer_id"
                                                    icon="id-card"
                                                    inputRef={el => { this.customer_id = el }}
                                                    group
                                                    className='mb-5'
                                                    type="text"
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
                                                    className='mb-5'
                                                    rows='1'
                                                />
                                                <MDBInput
                                                    onInput={this.handleInput}
                                                    value={this.state.invoiceMessage}
                                                    label="Invoice Message"
                                                    name="invoiceMessage"
                                                    icon="file-invoice"
                                                    group
                                                    type="textarea"
                                                    className='mb-4'
                                                    rows='1'
                                                />
                                                <MDBRow className='mt-0'>
                                                    <MDBCol sm='1' middle className=''>
                                                        <MDBIcon icon="object-group" size='2x' />
                                                    </MDBCol>
                                                    <MDBCol className='text-center'>
                                                        <label ref='label' style={{ fontFamily: 'monospace', color: '#6600cc' }}>{priceGroup ? priceGroup.length : 0} price-groups selected</label>
                                                        <Select
                                                            isMulti
                                                            styles={priceGroupStyles}
                                                            value={priceGroup}
                                                            onChange={this.handleSelectChange('priceGroup')}
                                                            options={priceGroupOptions}
                                                            placeholder='Price-Groups..'
                                                            isSearchable
                                                            isClearable
                                                            className='form-control-md pl-0'
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={false}
                                                        />
                                                    </MDBCol>
                                                </MDBRow>

                                                {
                                                    this.state.notificationShow ?
                                                        <MDBAnimation type="fadeInUp" >
                                                            <Notification
                                                                message={this.state.notificationMessage}
                                                                icon={"bell"}
                                                            />
                                                        </MDBAnimation>
                                                        : null
                                                }
                                                <LoaderModal
                                                    show={loaderShow}
                                                />
                                            </MDBCol>
                                            <div className='text-center'>
                                                <MDBBtn className='form-control py-0 font-weight-bold mb-2' size='lg' color="dark" outline type='submit'>Register</MDBBtn>
                                            </div>
                                        </MDBRow>
                                    </form>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </Can>
        );
    }
}


export default NewCustomer
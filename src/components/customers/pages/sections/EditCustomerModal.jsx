import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBAnimation, MDBRow, MDBCol, MDBIcon, MDBModalBody, MDBCard, MDBCardBody, MDBModalHeader, MDBInput } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../../misc/sections/Notification';
import chroma from 'chroma-js';
import makeAnimated from 'react-select/animated';


class EditCustomerModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            customerId: '',
            name: '',
            email: '',
            cell: '',
            address: '',
            shopName: '',
            postCode: '',
            customer_id: '',
            driverMessage: '',
            invoiceMessage: '',
            currentCustomerRoutes: [],
            currentCustomerPrices: [],
            allRoutes: [],
            allPriceGroups: [],
            allCustomerRoutes: [],
            allCustomerPrices: [],
            notificationMessage: '',
            notificationShow: false
        }
    }
    fetchData = (id) => {
        this._isMounted = true
        let specificCustomerPath = '/getSpecificCustomer/' + id
        let paths = [specificCustomerPath, '/getAllRoutes', '/getAllCustomerRoutes', '/getAllPriceGroups', '/getAllCustomerPrices']
        let dataRequests = paths.map(path => fetch(path))
        Promise.all(dataRequests)
            .then(responses => {
                Promise.all(responses.map(res => res.json()))
                    .then(jsons => {
                        let customer = jsons[0].data, allRoutes = jsons[1].data, allCustomerRoutes = jsons[2].data, allPriceGroups = jsons[3].data, allCustomerPrices = jsons[4].data
                        if (this._isMounted) {
                            this.setState({
                                customer: customer,
                                customerId: customer.id,
                                name: customer.name,
                                email: customer.email,
                                cell: customer.cell,
                                address: customer.address,
                                shopName: customer.shop_name,
                                postCode: customer.post_code,
                                customer_id: customer.customer_id,
                                driverMessage: customer.driver_message,
                                invoiceMessage: customer.invoice_message,
                                allRoutes: allRoutes,
                                allCustomerRoutes: allCustomerRoutes,
                                allPriceGroups: allPriceGroups,
                                allCustomerPrices: allCustomerPrices
                            })
                        }
                    })
                    .then(() => {
                        this.setCurrentCustomerRoutesAndPrices();
                    })
                    .then(() => {
                        this.toggle()
                        this.props.disappearLoaderModal()
                    })
            })
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,

        });
    }

    setCurrentCustomerRoutesAndPrices = () => {
        let { customerId, allRoutes, allCustomerRoutes, allPriceGroups, allCustomerPrices } = this.state, currentCustomerRoutes = [], currentCustomerPrices = []

        allCustomerRoutes.forEach(customerRoute => {
            if (customerRoute.customer_id === customerId) {
                let route = allRoutes.find(route => route.id === customerRoute.route_id)
                if (route) {
                    let CustomerRoute = {
                        key: route.id, label: route.name, value: route.id, color: route.id % 2 === 0 ?
                            '#3366cc' : '#006652'
                    }
                    currentCustomerRoutes.push(CustomerRoute)
                }
            }
        })

        allCustomerPrices.forEach(customerPrice => {
            if (customerPrice.customer_id === customerId) {
                let priceGroup = allPriceGroups.find(priceGroup => priceGroup.id === customerPrice.price_group_id)
                if (priceGroup) {
                    let CustomerPrice = {
                        key: priceGroup.id, label: priceGroup.name, value: priceGroup.id, color: priceGroup.id % 2 === 0 ?
                            '#3366cc' : '#006652'
                    }
                    currentCustomerPrices.push(CustomerPrice)
                }
            }
        })

        this.setState({
            currentCustomerRoutes: currentCustomerRoutes,
            currentCustomerPrices: currentCustomerPrices
        })
    }


    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = name => selectedOption => {
        this.setState({
            [name]: selectedOption
        })

    }

    handleSubmit = (e) => {
        let { currentCustomerPrices, currentCustomerRoutes } = this.state
        e.preventDefault();
        let form = this.refs.updateCustomerForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (currentCustomerPrices.length === 0 || currentCustomerPrices === null) {
            this.setState({ currentCustomerPrices: null })
            return
        }
        else if (currentCustomerRoutes.length === 0 || currentCustomerRoutes === null) {
            this.setState({ currentCustomerRoutes: null })
            return
        }
        else {
            let { customerId, name, email, cell, address, shopName, postCode, customer_id,
                driverMessage, invoiceMessage } = this.state
            // console.log(customerId, name, email, cell, address, shopName, postCode, customer_id, driverMessage, invoiceMessage);
            let customer = {
                id: customerId, name: name, email: email, cell: cell, address: address, shopName: shopName,
                postCode: postCode, customer_id: customer_id, driverMessage: driverMessage,
                invoiceMessage: invoiceMessage
            }
            let updateCustomerOptions = {
                method: 'PUT',
                body: JSON.stringify(customer),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/updateCustomer', updateCustomerOptions)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                        setTimeout(() => this.setState({ notificationShow: false }), 1002);
                    }
                    let customer = { customer_id: customerId }
                    let deleteOptions = {
                        method: 'DELETE',
                        body: JSON.stringify(customer),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    fetch('/deleteCustomerRoutes', deleteOptions)
                        .then((res) => res.json())
                        .then((json) => {
                            // console.log(json)
                            let Routes = []
                            currentCustomerRoutes.forEach(Route => {
                                let routeId = Route.value
                                Routes.push({ route_id: routeId, customer_id: customerId })
                            })

                            let customerRoutes = { Routes: Routes }
                            var customerRouteUpdateOptions = {
                                method: 'POST',
                                body: JSON.stringify(customerRoutes),
                                headers: { 'Content-Type': 'application/json' }
                            }
                            fetch('/addNewCustomerRoutes', customerRouteUpdateOptions)
                                .then((res) => res.json())
                                .then((json) => {
                                    // console.log(json)
                                })
                                .catch((error) => console.log(error))
                        })
                        .catch((error) => console.log(error))

                    fetch('/deleteCustomerPrices', deleteOptions)
                        .then((res) => res.json())
                        .then((json) => {
                            // console.log(json)
                            let Prices = []
                            currentCustomerPrices.forEach(PriceGroup => {
                                let priceGroupId = PriceGroup.value
                                Prices.push({ price_group_id: priceGroupId, customer_id: customerId })
                            })

                            let customerPrices = { Prices: Prices },
                                customerPriceUpdateOptions = {
                                    method: 'POST',
                                    body: JSON.stringify(customerPrices),
                                    headers: { 'Content-Type': 'application/json' }
                                }
                            fetch('/addNewCustomerPrices', customerPriceUpdateOptions)
                                .then((res) => res.json())
                                .then((json) => {
                                    // console.log(json)
                                    setTimeout(() => {
                                        // closing edit modal
                                        this.toggle()
                                    }, 502);
                                })
                                .catch((error) => console.log(error))
                        })
                        .catch((error) => console.log(error))
                })
                .catch((error) => console.log(error))
        }
    }





    render() {
        const { name, email, cell, address, shopName, postCode, customer_id, driverMessage, invoiceMessage, allRoutes, currentCustomerRoutes, allPriceGroups, currentCustomerPrices } = this.state
        const animatedComponents = makeAnimated();
        const routeStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : currentCustomerRoutes !== null ?
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
                    '#ddd' : currentCustomerPrices !== null ?
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
            <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='fluid' modalStyle="info" position="top">
                <MDBModalHeader toggle={this.toggle}>
                    Edit Customer Details
                    </MDBModalHeader>
                <MDBModalBody>
                    <MDBCard className='m-0 p-0'>
                        <MDBCardBody className='m-0 '>
                            <form ref='updateCustomerForm' onSubmit={this.handleSubmit} noValidate>
                                <MDBRow around className="grey-text">
                                    <MDBCol md="5">
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={name}
                                            label="Name"
                                            name='name'
                                            icon="user"
                                            group
                                            type="text"
                                            required
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={email}
                                            label="Email"
                                            name="email"
                                            icon="envelope"
                                            group
                                            type="email"
                                            required
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={cell}
                                            label="Phone"
                                            name="cell"
                                            icon="phone"
                                            group
                                            type="text"
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={address}
                                            label="Address"
                                            name="address"
                                            icon="map-marker-alt"
                                            group
                                            type="text"
                                            required
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={shopName}
                                            label="Shop Name"
                                            name="shopName"
                                            inputRef={el => { this.shopName = el }}
                                            icon="pen-fancy"
                                            group
                                            type="text"
                                            required
                                        />
                                        <MDBRow className='mt-5'>
                                            <MDBCol sm='1' middle className=''>
                                                <MDBIcon icon="route" size='2x' />
                                            </MDBCol>
                                            <MDBCol className='text-center'>
                                                <label ref='label' style={{ fontFamily: 'monospace', color: '#6600cc' }}>{currentCustomerRoutes ? currentCustomerRoutes.length : 0} routes selected</label>
                                                <Select
                                                    isMulti
                                                    styles={routeStyles}
                                                    value={currentCustomerRoutes}
                                                    onChange={this.handleSelectChange('currentCustomerRoutes')}
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
                                    <MDBCol md="5" middle>
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={postCode}
                                            label="Post Code"
                                            name="postCode"
                                            icon="envelope-open"
                                            group
                                            type="text"
                                            required
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={customer_id}
                                            label="Id."
                                            name="customer_id"
                                            icon="id-card"
                                            group
                                            type="text"
                                            required
                                            disabled
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={driverMessage}
                                            label="Driver's Message"
                                            name="driverMessage"
                                            icon="comment"
                                            group
                                            type="textarea"
                                            rows='1'
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={invoiceMessage}
                                            label="Invoice Message"
                                            name="invoiceMessage"
                                            icon="file-invoice"
                                            group
                                            type="textarea"
                                            rows='1'
                                        />
                                        <MDBRow className='my-5'>
                                            <MDBCol sm='1' middle className=''>
                                                <MDBIcon icon="object-group" size='2x' />
                                            </MDBCol>
                                            <MDBCol className='text-center'>
                                                <label ref='label' style={{ fontFamily: 'monospace', color: '#6600cc' }}>{currentCustomerPrices ? currentCustomerPrices.length : 0} price-groups selected</label>
                                                <Select
                                                    isMulti
                                                    styles={priceGroupStyles}
                                                    value={currentCustomerPrices}
                                                    onChange={this.handleSelectChange('currentCustomerPrices')}
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
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow center>
                                    <MDBBtn size='sm' className=' mt-4 font-weight-bold' color="dark" onClick={this.toggle}>Close</MDBBtn>
                                    <MDBBtn size='sm' className=' mt-4 font-weight-bold' onClick={this.handleSubmit} outline color="dark">Save updates</MDBBtn>
                                </MDBRow>
                            </form>
                        </MDBCardBody>
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
                    </MDBCard>
                </MDBModalBody>
            </MDBModal>
        );
    }
}

export default EditCustomerModal;
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'
import { func } from 'prop-types';
import { promises } from 'dns';
import { Promise } from 'q';



class SetCustomerPrices extends Component {
    _isMounted = false
    constructor() {
        super();
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
            customers: [],
            priceGroups: [],
            customerPrices: [],
            customer: '',
            priceGroup: '',
            notificationMessage: '',
            notificationShow: false
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


    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.customer === '' || this.state.customer === null) {
            this.setState({ customer: null })
            return
        }
        else if (this.state.priceGroup === '' || this.state.priceGroup === null) {
            this.setState({ priceGroup: null })
            return
        }
        else {
            let { customer, priceGroup, priceGroups } = this.state
            let customerId = customer.value
            let priceGroupId = priceGroup.value
            // console.log(customerId, priceGroupId);

            //validating that customer have not that product's price already
            let customerPriceGroups = [];
            let productId, customerAllPrices, create = true;
            let promise = fetch('/getAllCustomerPrices')
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    this.setState({ customerPrices: json.data })
                })
                .catch((error) => console.log(error))

            Promise.all([promise]).then(() => {

                //finding all price-groups assidned to customer
                customerAllPrices = this.state.customerPrices
                    .filter(customerPrice => customerPrice.customer_id === customerId);

                //getting customer's price-groups' data
                customerAllPrices.forEach(customerPrice => {
                    let a = priceGroups.filter(priceGroup => priceGroup.id === customerPrice.price_group_id)
                    let priceGroup = a.shift()
                    customerPriceGroups.push(priceGroup)
                });

                //finding coming price-group's product-id
                priceGroups.forEach(priceGroup => {
                    if (priceGroup.id === priceGroupId) {
                        productId = priceGroup.product_id
                    }
                })

                //validating that customer have not that price-group already
                customerPriceGroups.forEach(existedPriceGroup => {
                    if (existedPriceGroup.id === priceGroupId) {
                        if (this._isMounted === true) {
                            this.setState({ notificationMessage: 'Customer already have that price-group', notificationShow: true })
                            setTimeout(() => { this.setState({ notificationShow: false }) }, 1600)
                        }
                        create = false
                        return;
                    }
                    else if (existedPriceGroup.product_id === productId) {
                        if (this._isMounted === true) {
                            this.setState({ notificationMessage: `Customer already have that product's price.`, notificationShow: true })
                            setTimeout(() => { this.setState({ notificationShow: false }) }, 1600)
                        }
                        create = false
                        return;
                    }
                })

                if (create) {
                    let customerPrice = { customerId: customerId, priceGroupId: priceGroupId }
                    var options = {
                        method: 'POST',
                        body: JSON.stringify(customerPrice),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    fetch('/addNewCustomerPrice', options)
                        .then((res) => res.json())
                        .then((json) => {
                            console.log(json)
                            if (this._isMounted === true) {
                                this.setState({ notificationMessage: json.message, notificationShow: true })
                            }
                            if (json.success === true) {

                                this.setState({
                                    customer: '',
                                    priceGroup: '',
                                })
                            }
                            else {
                                this.priceGroup.focus();
                            }
                        })
                        .catch((error) => console.log(error))
                }
            })
        }
    }

    render() {

        const { customer, priceGroup, customers, priceGroups } = this.state
        const customerStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : customer !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            })
        }
        const priceGroupStyles = {
            control: (base, state) => ({
                ...base,
                borderBottomColor: state.isFocused ?
                    '#ddd' : priceGroup !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            })
        }
        var customerOptions;
        var priceGroupOptions;
        customerOptions = customers.map(customer => ({ key: customer.id, label: customer.name, value: customer.id }));
        priceGroupOptions = priceGroups.map(priceGroup => ({ key: priceGroup.id, label: priceGroup.name, value: priceGroup.id }));
        // if (showOptions) {

        // }


        return (
            // <Can I='create' a='customerPrice'>
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="6">
                        <MDBCard className=' p-5'>

                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="mb-5 text-center font-weight-bold">
                                Set Customer's Price-Groups
                                </MDBCardHeader>
                            <MDBCardBody className='p-0'>

                                <form onSubmit={this.handleSubmit} className='text-center'>
                                    <MDBRow className='mb-5 grey-text'>
                                        <MDBCol sm='1' className=''>
                                            <MDBIcon icon="user-alt" size='2x' />
                                        </MDBCol>
                                        <MDBCol>
                                            <Select
                                                styles={customerStyles}
                                                value={customer}
                                                onChange={this.handleSelectChange('customer')}
                                                options={customerOptions}
                                                placeholder='Customer'
                                                isSearchable
                                                isClearable
                                                className='form-control-lg px-0'
                                            />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className='mb-5 grey-text'>
                                        <MDBCol sm='1' className=''>
                                            <MDBIcon icon="search-dollar" size='2x' />
                                        </MDBCol>
                                        <MDBCol>
                                            <Select
                                                styles={priceGroupStyles}
                                                value={priceGroup}
                                                onChange={this.handleSelectChange('priceGroup')}
                                                options={priceGroupOptions}
                                                placeholder='Price-Group'
                                                isSearchable
                                                isClearable
                                                className='form-control-lg px-0'
                                                ref={el => this.priceGroup = el}
                                            />
                                        </MDBCol>
                                    </MDBRow>

                                    <MDBBtn size='sm' className='mb-5' color="dark" outline type='submit'>Submit</MDBBtn>
                                </form>
                                <Link to='/customerPricing/all'>All Customer Prices..</Link>
                            </MDBCardBody>
                        </MDBCard>
                        {
                            this.state.notificationShow ?
                                <Notification
                                    message={this.state.notificationMessage}
                                />
                                : null
                        }
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            // </Can>
        );
    }
}


export default SetCustomerPrices
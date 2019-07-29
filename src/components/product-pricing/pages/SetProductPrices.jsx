import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBCardBody, MDBCardHeader, MDBInput, MDBCard } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class SetProductPrices extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data })
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
            products: [],
            priceGroups: [],
            product: '',
            priceGroup: '',
            sellPrice: '',
            buyBackPrice: '',
            notificationMessage: '',
            notificationShow: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = selectedOption => {
        this.setState({
            selectedOption
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.newProductPriceForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.product === '' || this.state.product === null) {
            this.setState({ product: null })
            return
        }
        else if (this.state.priceGroup === '' || this.state.priceGroup === null) {
            this.setState({ priceGroup: null })
            return
        }
        else {

            let { priceGroup, product, sellPrice, buyBackPrice } = this.state
            console.log(priceGroup, product, sellPrice, buyBackPrice);

            let prodcutPrice = {
                priceGroupId: priceGroup.value, productId: product.value,
                sellPrice: sellPrice, buyBackPrice: buyBackPrice
            }

            var options = {
                method: 'POST',
                body: JSON.stringify(prodcutPrice),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewProductPrice', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            product: '',
                            priceGroup: '',
                            sellPrice: '',
                            buyBackPrice: '',
                        })
                    }
                    else {
                        this.product.focus();
                    }
                    if (this._isMounted === true) {
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);

                    }
                })
                .catch((error) => console.log(error))
        }
    }

    render() {

        const { product, priceGroup, products, priceGroups, sellPrice, buyBackPrice } = this.state
        const produtcStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : product !== null ?
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
        var productOptions;
        var priceGroupOptions;
        productOptions = products.map(product => ({ key: product.id, label: product.name, value: product.id }));
        priceGroupOptions = priceGroups.map(priceGroup => ({ key: priceGroup.id, label: priceGroup.name, value: priceGroup.id }));
        // if (showOptions) {

        // }


        return (
            // <Can I='create' a='productPrice'>
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="6">
                        <MDBCard className=' p-5'>

                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="mb-5 text-center font-weight-bold">
                                Set Products' Prices
                            </MDBCardHeader>

                            <MDBCardBody className='p-0'>
                                <form onSubmit={this.handleSubmit} ref='newProductPriceForm' className='grey-text'>
                                    <MDBRow className='mb-5'>
                                        <MDBCol sm='1' className=''>
                                            <MDBIcon icon="user-alt" />
                                        </MDBCol>
                                        <MDBCol>
                                            <Select
                                                styles={produtcStyles}
                                                value={product}
                                                onChange={this.handleSelectChange}
                                                options={productOptions}
                                                placeholder='Product'
                                                isSearchable
                                                isClearable
                                                className='form-control-md px-0'
                                            />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className='mb-5'>
                                        <MDBCol sm='1' className=''>
                                            <MDBIcon icon="search-dollar" />
                                        </MDBCol>
                                        <MDBCol>
                                            <Select
                                                styles={priceGroupStyles}
                                                value={priceGroup}
                                                onChange={this.handleSelectChange}
                                                options={priceGroupOptions}
                                                placeholder='Price-Group'
                                                isSearchable
                                                isClearable
                                                className='form-control-md px-0'
                                            />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBInput
                                        onInput={this.handleInput}
                                        value={sellPrice}
                                        label="Selling Price"
                                        name="sellPrice"
                                        icon="dollar-sign"
                                        group
                                        type="number"
                                        validate
                                        error="wrong"
                                        success="right"
                                        required
                                    />
                                    <MDBInput
                                        onInput={this.handleInput}
                                        value={buyBackPrice}
                                        label="Buying-back Price"
                                        name="buyBackPrice"
                                        icon="dollar-sign"
                                        group
                                        type="number"
                                        validate
                                        error="wrong"
                                        success="right"
                                    />
                                    <div className="text-center">
                                        <MDBBtn size='sm' className='mb-5 text-center' color="dark" outline type='submit'>Submit</MDBBtn>
                                    </div>
                                </form>
                                <Link to='/productPricing/all'>All Products' Prices..</Link>
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


export default SetProductPrices
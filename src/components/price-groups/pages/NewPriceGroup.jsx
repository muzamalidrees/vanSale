import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard, MDBIcon } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class NewPriceGroup extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllProductCategories')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ productCategories: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            products: [],
            name: '',
            product: '',
            sellPrice: '',
            buyBackPrice: '',
            isDisabled: true,
            productCategory: '',
            productCategories: [],
            notificationMessage: '',
            notificationShow: false,
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = name => selectedOption => {
        if (name === 'category') {
            if (selectedOption !== null) {
                let products = this.state.products.filter(product => product.product_category_id === selectedOption.value)
                this.setState({
                    productCategory: selectedOption,
                    products: products,
                    isDisabled: false
                })
            }
            else {
                this.setState({
                    productCategory: selectedOption,
                    isDisabled: true
                })
            }
        }
        else {
            this.setState({
                product: selectedOption
            })
        }
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.newPriceGroupForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.productCategory === '' || this.state.productCategory === null) {
            this.setState({ productCategory: null })
            return
        }
        else if (this.state.product === '' || this.state.product === null) {
            this.setState({ product: null })
            return
        }
        else {

            let { name, productCategory, product, sellPrice, buyBackPrice } = this.state

            console.log(name, productCategory, product, sellPrice, buyBackPrice);

            let priceGroup = {
                name: name, productCategoryId: productCategory.value, productId: product.value, sellPrice: sellPrice, buyBackPrice: buyBackPrice
            }

            var options = {
                method: 'POST',
                body: JSON.stringify(priceGroup),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewPriceGroup', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            name: '',
                            product: '',
                            sellPrice: '',
                            buyBackPrice: '',
                            isDisabled: true,
                            productCategory: '',
                        })
                    }
                    else {
                        this.name.focus();
                    }
                    if (this._isMounted === true) {
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);

                    }
                })
                .catch((error) => console.log(error))
        }
    }

    render() {

        const { productCategory, productCategories, product, products, sellPrice, buyBackPrice, isDisabled } = this.state
        const categoryStyles = {
            control: (base, state) => ({
                ...base,
                borderBottomColor: state.isFocused ?
                    '#ddd' : productCategory !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            })
        }
        const productStyles = {
            control: (base, state) => ({
                ...base,
                borderBottomColor: state.isFocused ?
                    '#ddd' : product !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            })
        }

        let CategoryOptions = productCategories.map(productCategory => ({ key: productCategory.id, label: productCategory.name, value: productCategory.id }));
        let productOptions = products.map(product => ({ key: product.id, label: product.name, value: product.id }));


        return (
            // <Can I='create' a='priceGroup'>
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="6">
                        <MDBCard className=' p-5'>

                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                New PriceGroup
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>

                                <form ref='newPriceGroupForm' onSubmit={this.handleSubmit} noValidate>
                                    <div className="grey-text">
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={this.state.name}
                                            label="Name"
                                            name='name'
                                            icon="pen-nib"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            required
                                        />
                                        <MDBRow className='mb-5 grey-text'>
                                            <MDBCol sm='1' className=''>
                                                <MDBIcon icon="th" size='2x' />
                                            </MDBCol>
                                            <MDBCol>
                                                <Select
                                                    styles={categoryStyles}
                                                    value={productCategory}
                                                    onChange={this.handleSelectChange('category')}
                                                    options={CategoryOptions}
                                                    placeholder='Product-Category'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-md px-0'
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow className='mb-5 grey-text'>
                                            <MDBCol sm='1' className=''>
                                                <MDBIcon icon="th" size='2x' />
                                            </MDBCol>
                                            <MDBCol>
                                                <Select
                                                    ref={el => this.product = el}
                                                    styles={productStyles}
                                                    value={product}
                                                    onChange={this.handleSelectChange('product')}
                                                    options={productOptions}
                                                    placeholder='Product'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-md px-0'
                                                    isDisabled={isDisabled}
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
                                            required
                                        />
                                    </div>
                                    <div className="text-center">
                                        <MDBBtn size='sm' color="dark" outline type='submit'>Submit</MDBBtn>
                                    </div>
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


export default NewPriceGroup
import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard, MDBIcon } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'
import { Promise } from 'q';



class NewPriceGroup extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllProductCategories')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ productCategories: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            products: [],
            name: '',
            productCategory: '',
            productCategories: [],
            notificationMessage: '',
            notificationShow: false,
            productOptions: []
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = name => selectedOption => {
        if (name === 'category') {
            if (selectedOption !== null) {
                let selectedProducts = this.state.products.filter(product => product.product_category_id === selectedOption.value)
                let productOptions = selectedProducts.map((product, index) => ({ index: index, id: product.id, name: product.name, sellPrice: '', buyBackPrice: '' }));
                this.setState({
                    productCategory: selectedOption,
                    productOptions: productOptions,
                })
            }
            else {
                this.setState({
                    productCategory: selectedOption,
                    selectedProducts: []
                })
            }
        }
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handlePricingInput = index => e => {
        var stateCopy = Object.assign({}, this.state);
        stateCopy.productOptions[index][e.target.name] = e.target.value;
        this.setState(stateCopy);
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
        else {

            let { name, productCategory, productOptions } = this.state
            let priceGroupId;
            console.log(name, productCategory, productOptions);

            let priceGroup = {
                name: name, productCategoryId: productCategory.value
            }

            let options = {
                method: 'POST',
                body: JSON.stringify(priceGroup),
                headers: { 'Content-Type': 'application/json' }
            }
            let promise = fetch('/addNewPriceGroup', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    priceGroupId = json.data.id
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);
                    }
                    if (json.success === true) {

                        this.setState({
                            name: '',
                            productOptions: [],
                            productCategory: '',
                        })
                    }
                    else {
                        this.name.focus();
                        return
                    }
                })
                .catch((error) => console.log(error))

            Promise.all([promise]).then(() => {
                if (priceGroupId !== undefined && priceGroupId !== null) {
                    productOptions.forEach(product => {

                        let productPrice = {
                            priceGroupId: priceGroupId, productId: product.id,
                            sellPrice: product.sellPrice, buyBackPrice: product.buyBackPrice
                        }
                        let options = {
                            method: 'POST',
                            body: JSON.stringify(productPrice),
                            headers: { 'Content-Type': 'application/json' }
                        }
                        fetch('/addNewProductPrice', options)
                            .then((res) => res.json())
                            .then((json) => {
                                console.log(json)
                            })
                            .catch((error) => console.log(error))
                    })
                }
            })
        }
    }

    render() {
        let currentComponent = this
        const { productCategory, productCategories, productOptions } = this.state
        const categoryStyles = {
            control: (base, state) => ({
                ...base,
                borderBottomColor: state.isFocused ?
                    '#ddd' : productCategory !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,

            })
        }

        let CategoryOptions = productCategories.map(productCategory => ({ key: productCategory.id, label: productCategory.name, value: productCategory.id }));
        let productViews = []
        productOptions.forEach(product => productViews.push(productView(product.index, product.id, product.name, product.sellPrice, product.buyBackPrice)))
        function productView(index, id, name, sellPrice, buyBackPrice) {
            return <React.Fragment key={id}>
                <MDBCol md='6'>
                    <MDBRow>
                        <MDBCol md className='mx-2'>
                            <MDBInput
                                value={name}
                                label="Name"
                                name='name'
                                type="text"
                                validate
                                error="wrong"
                                success="right"
                                disabled
                            />
                        </MDBCol>
                        <MDBCol md className='mx-2'>
                            <MDBInput
                                onInput={currentComponent.handlePricingInput(index)}
                                value={sellPrice}
                                label="Selling-Price"
                                name='sellPrice'
                                type="number"
                                validate
                                error="wrong"
                                success="right"
                                required
                            />
                        </MDBCol>
                        <MDBCol md className='mx-2'>
                            <MDBInput
                                onInput={currentComponent.handlePricingInput(index)}
                                value={buyBackPrice}
                                label="Buying-back-Price"
                                name='buyBackPrice'
                                type="number"
                                validate
                                error="wrong"
                                success="right"
                                required
                            />
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
            </React.Fragment>
        }

        return (
            // <Can I='create' a='priceGroup'>
            <MDBContainer className=' p-0' fluid style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="11">
                        <MDBCard className='p-3'>
                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                New PriceGroup
                            </MDBCardHeader>
                            <MDBCardBody className='px-5'>
                                <form ref='newPriceGroupForm' onSubmit={this.handleSubmit} noValidate>
                                    <MDBRow center className="grey-text">
                                        <MDBCol md='4' middle>
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.name}
                                                label="Name"
                                                name='name'
                                                group
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                                outline
                                            />
                                        </MDBCol>
                                        <MDBCol md='4' middle>
                                            <MDBRow className='mb-3 grey-text'>
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
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        {productViews}
                                    </MDBRow>
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
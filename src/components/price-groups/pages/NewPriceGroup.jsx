import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
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
            productOptions: [],
            labelRow: false
        };

        this.handleSelectChange = this.handleSelectChange.bind(this)
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
                    labelRow: true
                })
            }
            else {
                this.setState({
                    productCategory: selectedOption,
                    selectedProducts: [],
                    labelRow: false
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
            // console.log(name, productCategory, productOptions);

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
                    if (json.data) {
                        priceGroupId = json.data.id
                    }
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
                                // console.log(json)
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
                <MDBRow>
                    <MDBCol lg='4' className='mx-2 text-center'>
                        <MDBInput
                            value={name}
                            name='name'
                            type="text"
                            validate
                            error="wrong"
                            success="right"
                            disabled
                            outline
                        />
                    </MDBCol>
                    <MDBCol lg='3' className='mx-2 text-center'>
                        <MDBInput
                            onInput={currentComponent.handlePricingInput(index)}
                            value={sellPrice}
                            name='sellPrice'
                            type="number"
                            validate
                            error="wrong"
                            success="right"
                            required
                            outline
                        />
                    </MDBCol>
                    <MDBCol lg='4' className='mx-2 text-center'>
                        <MDBInput
                            onInput={currentComponent.handlePricingInput(index)}
                            value={buyBackPrice}
                            name='buyBackPrice'
                            type="number"
                            validate
                            error="wrong"
                            success="right"
                            required
                            outline
                        />
                    </MDBCol>
                </MDBRow>
            </React.Fragment>
        }

        return (
            <Can I='create' a='priceGroup'>
            <MDBContainer className=' p-0' fluid style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="11">
                        <MDBCard className='p-3'>
                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                New PriceGroup
                            </MDBCardHeader>
                            <MDBCardBody className='px-5'>
                                <form ref='newPriceGroupForm' onSubmit={this.handleSubmit} noValidate>
                                    <MDBRow className="grey-text ">
                                        <MDBCol md='4' middle>
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.name}
                                                label="Name"
                                                name='name'
                                                inputRef={el => this.name = el}
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
                                    {this.state.labelRow ?
                                        <MDBRow >
                                            <MDBCol lg='8'>
                                                <MDBRow>
                                                    <MDBCol lg='4' className='mx-2 text-center font-weight-bold'>
                                                        <label>Product</label>
                                                    </MDBCol>
                                                    <MDBCol lg='3' className='mx-2 text-center font-weight-bold'>
                                                        <label>Selling-Price</label>
                                                    </MDBCol>
                                                    <MDBCol lg='4' className='mx-2 text-center font-weight-bold'>
                                                        <label>Buying-back-Price</label>
                                                    </MDBCol>
                                                </MDBRow>
                                                {productViews}
                                            </MDBCol>
                                        </MDBRow>
                                        :
                                        null}
                                    <MDBRow >
                                        <MDBCol md='3'>
                                            <MDBBtn className='py-0 font-weight-bold form-control' color="dark" outline type='submit'>Submit</MDBBtn>
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
            </Can>
        );
    }
}


export default NewPriceGroup
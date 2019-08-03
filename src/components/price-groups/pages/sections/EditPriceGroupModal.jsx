import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBCard, MDBRow, MDBCol, MDBIcon, MDBCardBody, MDBModalHeader, MDBInput } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../../misc/sections/Notification';



class EditPriceGroupModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            name: '',
            product: '',
            sellPrice: '',
            buyBackPrice: '',
            productCategory: '',
            isDisabled: false,
            notificationMessage: '',
            notificationShow: false,
            priceGroupId: '',
            productId: '',
            productCategoryId: '',
            products: [],
            productOptions: [],
            productCategoryOptions: [],
        }
    }

    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificPriceGroup/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                let priceGroup = json.data
                if (this._isMounted === true) {
                    this.setState({
                        priceGroupId: priceGroup.id,
                        name: priceGroup.name,
                        productId: priceGroup.product_id,
                        sellPrice: priceGroup.sell_price,
                        buyBackPrice: priceGroup.buy_back_price,
                        productCategoryId: priceGroup.product_category_id,
                    })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllProductCategories')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                this.setProductCategoryOptions(json.data)

            })
            .catch((error) => console.log(error))

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted === true) {
                    this.setState({
                        products: json.data
                    })
                }
                this.setProductOptions(json.data)
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

    setProductCategoryOptions = (productCategories) => {
        let productCategoryOptions = productCategories.map(productCategory => ({ key: productCategory.id, label: productCategory.name, value: productCategory.id }));
        let currentProductCategory;
        productCategories.forEach(productCategory => {
            if (productCategory.id === this.state.productCategoryId) {
                currentProductCategory = { label: productCategory.name, value: productCategory.id }
            }
        });
        this.setState({
            productCategoryOptions: productCategoryOptions, productCategory: currentProductCategory,
        })
    }

    setProductOptions = (products) => {
        let productOptions = products.map(product => ({ key: product.id, label: product.name, value: product.id }));
        let currentProduct;
        products.forEach(product => {
            if (product.id === this.state.productId) {
                currentProduct = { label: product.name, value: product.id }
            }
        });
        this.setState({
            productOptions: productOptions, product: currentProduct,
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = name => selectedOption => {
        if (name === 'category') {
            if (selectedOption !== null) {
                let products = this.state.products.filter(product => product.product_category_id === selectedOption.value)
                let productOptions = products.map(product => ({ key: product.id, label: product.name, value: product.id }));
                this.setState({
                    productCategory: selectedOption,
                    productOptions: productOptions,
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

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.updatePriceGroupForm
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
            let { priceGroupId, name, productCategory, product, sellPrice, buyBackPrice } = this.state

            console.log(priceGroupId, name, productCategory, product, sellPrice, buyBackPrice);

            let priceGroup = {
                id: priceGroupId, name: name, productId: product.value, productCategoryId: productCategory.value,
                sellPrice: sellPrice, buyBackPrice: buyBackPrice
            }

            var options = {
                method: 'PUT',
                body: JSON.stringify(priceGroup),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/updatePriceGroup', options)
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
        const { productCategory, productCategoryOptions, product, productOptions, name, sellPrice, buyBackPrice,isDisabled } = this.state
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


        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='md' centered>
                    <MDBModalHeader toggle={this.toggle}>
                        Edit Price-Group Details
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>
                                <form ref='updatePriceGroupForm' onSubmit={this.handleSubmit} noValidate>
                                    <div className="grey-text">
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={name}
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
                                            <MDBCol >
                                                <Select
                                                    styles={categoryStyles}
                                                    value={productCategory}
                                                    onChange={this.handleSelectChange('category')}
                                                    options={productCategoryOptions}
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
                                        />

                                    </div>

                                </form>

                                <div className='text-center'>
                                    <MDBBtn size='sm' className='font-weight-bold' color="dark" onClick={this.toggle}>Close</MDBBtn>
                                    <MDBBtn size='sm' className='font-weight-bold' onClick={this.handleSubmit} outline color="dark">Save updates</MDBBtn>
                                </div>
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

export default EditPriceGroupModal;
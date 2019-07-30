import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBCard, MDBRow, MDBCol, MDBIcon, MDBCardBody, MDBModalHeader, MDBInput } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../../misc/sections/Notification';



class EditProductPriceModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            productPriceId: '',
            priceGroupId: '',
            productId: '',
            sellPrice: '',
            buyBackPrice: '',
            priceGroups: [],
            products: [],
            notificationMessage: '',
            notificationShow: false,
            product: '',
            priceGroup: '',
            priceGroupOptions: [],
            productOptions: []
        }
    }

    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificProductPrice/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                let productPrice = json.data
                if (this._isMounted === true) {
                    this.setState({
                        productPriceId: productPrice.id,
                        priceGroupId: productPrice.price_group_id,
                        productId: productPrice.product_id,
                        sellPrice: productPrice.sell_price,
                        buyBackPrice: productPrice.buy_back_price,
                    })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllPriceGroups')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                this.setPriceGroupOptions(json.data);
            })
            .catch((error) => console.log(error))
        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                this.setProductOptions(json.data);
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

    setPriceGroupOptions = (priceGroups) => {
        let priceGroupOptions = priceGroups.map(priceGroup => ({ key: priceGroup.id, label: priceGroup.name, value: priceGroup.id }));
        let currentPriceGroup;
        priceGroups.forEach(priceGroup => {
            if (priceGroup.id === this.state.priceGroupId) {
                currentPriceGroup = { label: priceGroup.name, value: priceGroup.id }
            }
        });
        this.setState({
            priceGroupOptions: priceGroupOptions, priceGroup: currentPriceGroup,
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

    handleSelectChange = selectedOption => {
        this.setState({
            selectedOption
        })

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.updateProductPriceForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.priceGroup === '' || this.state.priceGroup === null) {
            this.setState({ priceGroup: null })
            return
        }
        else if (this.state.product === '' || this.state.product === null) {
            this.setState({ product: null })
            return
        }
        else {
            let { productPriceId, priceGroup, product, sellPrice, buyBackPrice } = this.state
            console.log(productPriceId, priceGroup, product, sellPrice, buyBackPrice);


            let productPrice = {
                id: productPriceId, priceGroupId: priceGroup.value, productId: product.value,
                sellPrice: sellPrice, buyBackPrice: buyBackPrice
            }

            var options = {
                method: 'PUT',
                body: JSON.stringify(productPrice),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/updateProductPrice', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                        setTimeout(() => {
                            this.setState({ notificationShow: false })
                            //closing edit modal

                            this.toggle()
                        }, 1502);
                    }
                })
                .catch((error) => console.log(error))

            // refreshing all records table
            window.location.reload();
        }
    }





    render() {
        const { priceGroup, priceGroupOptions, product, productOptions, sellPrice, buyBackPrice } = this.state
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
                        Edit Product's Price
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>
                                <form ref='updateProductPriceForm' onSubmit={this.handleSubmit} noValidate>
                                    <div className="grey-text">
                                        <MDBRow className='mb-5 grey-text'>
                                            <MDBCol sm='2' className='pr-0 mr-0'>
                                                <MDBIcon icon="file-alt" size='2x' />
                                            </MDBCol>
                                            <MDBCol className='ml-0 pl-0'>
                                                <Select
                                                    styles={priceGroupStyles}
                                                    value={priceGroup}
                                                    onChange={this.handleSelectChange}
                                                    options={priceGroupOptions}
                                                    placeholder='Price-Group'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-md'
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow className='mb-5 grey-text'>
                                            <MDBCol sm='2' className='pr-0 mr-0'>
                                                <MDBIcon icon="file-alt" size='2x' />
                                            </MDBCol>
                                            <MDBCol className='ml-0 pl-0'>
                                                <Select
                                                    styles={productStyles}
                                                    value={product}
                                                    onChange={this.handleSelectChange}
                                                    options={productOptions}
                                                    placeholder='Product'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-md'
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

export default EditProductPriceModal;
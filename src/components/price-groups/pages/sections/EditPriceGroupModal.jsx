import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBCard,MDBAnimation, MDBRow, MDBCol, MDBCardBody, MDBModalHeader, MDBInput } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../../misc/sections/Notification';



class EditPriceGroupModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            name: '',
            priceGroupId: '',
            productCategoryId: '',
            products: [],
            productCategories: [],
            notificationMessage: '',
            notificationShow: false,
            productOptions: []
        }
    }

    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificPriceGroup/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                let priceGroup = json.data
                if (this._isMounted === true) {
                    this.setState({
                        priceGroupId: priceGroup.id,
                        name: priceGroup.name,
                        productCategoryId: priceGroup.product_category_id,
                    })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllProductCategories')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted === true) {
                    this.setState({
                        productCategories: json.data
                    })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted === true) {
                    this.setState({
                        products: json.data
                    })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getSpecificProductPrices/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                let productOptions = json.data.map((PP, index) =>
                    ({ index: index, id: PP.id, productId: PP.product_id, sellPrice: PP.sell_price, buyBackPrice: PP.buy_back_price }));
                this.setState({
                    productOptions: productOptions
                })
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
        let form = this.refs.updatePriceGroupForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else {

            let { name, productCategoryId, productOptions, priceGroupId } = this.state
            // console.log(name, productCategoryId, productOptions);

            let priceGroup = {
                id: priceGroupId, name: name, productCategoryId: productCategoryId
            }

            let options = {
                method: 'PUT',
                body: JSON.stringify(priceGroup),
                headers: { 'Content-Type': 'application/json' }
            }
            // console.log(priceGroup);

            fetch('/updatePriceGroup', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);
                    }
                    if (json.success === true) {

                        this.setState({
                            name: '',
                            productOptions: [],
                            productCategoryId: '',
                        })
                        this.toggle()
                        window.location.reload()
                    }
                    else {
                        this.name.focus();
                        return
                    }
                })
                .catch((error) => console.log(error))

            productOptions.forEach(product => {

                let productPrice = {
                    id: product.id, priceGroupId: priceGroupId, productId: product.productId,
                    sellPrice: product.sellPrice, buyBackPrice: product.buyBackPrice
                }
                let options = {
                    method: 'PUT',
                    body: JSON.stringify(productPrice),
                    headers: { 'Content-Type': 'application/json' }
                }
                console.log(productPrice);

                fetch('/updateProductPrice', options)
                    .then((res) => res.json())
                    .then((json) => {
                        // console.log(json)
                    })
                    .catch((error) => console.log(error))
            })
        }
    }





    render() {
        let currentComponent = this
        let { productCategoryId, productCategories, productOptions, products, name } = this.state

        let currentProductCategory;
        if (productCategories !== '' && productCategories !== null && productCategories !== undefined) {
            productCategories.forEach(productCategory => {
                if (productCategory.id === productCategoryId) {
                    currentProductCategory = { label: productCategory.name, value: productCategory.id }
                }
            });
        }

        let productViews = []
        productOptions.forEach((option) => {
            let currentProduct;
            if (products !== '' && products !== null && products !== undefined) {
                products.forEach(product => {
                    if (product.id === option.productId) {
                        currentProduct = product.name
                    }
                });
            }
            productViews.push(productView(option.index, option.id, currentProduct, option.sellPrice, option.buyBackPrice))
        }
        )

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
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' centered>
                    <MDBModalHeader toggle={this.toggle}>
                        Edit Price-Group Details
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBRow center>
                            <MDBCol md="11">
                                <MDBCard className='p-3'>
                                    <MDBCardBody className='px-5'>
                                        <form ref='updatePriceGroupForm' onSubmit={this.handleSubmit} noValidate>
                                            <MDBRow center className="grey-text">
                                                <MDBCol md='4' middle>
                                                    <MDBInput
                                                        onInput={this.handleInput}
                                                        value={name}
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
                                                                value={currentProductCategory}
                                                                isDisabled={true}
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
                                                <MDBBtn size='sm' color="dark" onClick={this.toggle} >Close</MDBBtn>
                                                <MDBBtn size='sm' color="dark" outline type='submit'>Save updates</MDBBtn>
                                            </div>
                                        </form>
                                    </MDBCardBody>
                                </MDBCard>
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
                            </MDBCol>
                        </MDBRow>
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default EditPriceGroupModal;
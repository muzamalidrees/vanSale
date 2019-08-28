import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBRow, MDBCol, MDBInput } from 'mdbreact';
import Select from 'react-select';



class viewPriceGroupModal extends Component {
    _isMounted = false
    constructor() {
        super();
        this.state = {
            modalShow: false,
            name: '',
            productCategoryId: '',
            productCategories: [],
            productOptions: [],
            products: []

        }
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,

        });
    }

    fetchData = (id) => {
        this._isMounted = true
        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getSpecificPriceGroup/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                let priceGroup = json.data
                this.setState({
                    name: priceGroup.name,
                    productCategoryId: priceGroup.product_category_id
                })

            })
            .catch((error) => console.log(error))

        fetch('/getSpecificProductPrices/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                this.setState({
                    productOptions: json.data
                })
            })
            .catch((error) => console.log(error))

        fetch('/getAllProductCategories')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ productCategories: json.data })
                }
            })
            .catch((error) => console.log(error))
    }

    render() {

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
                    if (product.id === option.product_id) {
                        currentProduct = product.name
                    }
                });
            }
            productViews.push(productView(option.id, currentProduct, option.sell_price, option.buy_back_price))
        }
        )

        function productView(id, name, sellPrice, buyBackPrice) {
            return <React.Fragment key={id}>
                <MDBCol md='6'>
                    <MDBRow>
                        <MDBCol md className='mx-2'>
                            <MDBInput
                                value={name}
                                label="Name"
                                name='name'
                                type="text"
                                disabled
                            />
                        </MDBCol>
                        <MDBCol md className='mx-2'>
                            <MDBInput
                                value={sellPrice}
                                label="Selling-Price"
                                name='sellPrice'
                                type="number"
                                disabled
                            />
                        </MDBCol>
                        <MDBCol md className='mx-2'>
                            <MDBInput
                                value={buyBackPrice}
                                label="Buying-back-Price"
                                name='buyBackPrice'
                                type="number"
                                disabled
                            />
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
            </React.Fragment>
        }
        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' centered>
                    <MDBModalHeader toggle={this.toggle}>Price-Group details</MDBModalHeader>
                    <MDBModalBody>
                        <MDBRow center>
                            <MDBCol md="11">
                                <form ref='newPriceGroupForm' onSubmit={this.handleSubmit} noValidate>
                                    <MDBRow center className=" m-0 p- 0 grey-text">
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
                                                disabled
                                                outline
                                            />
                                        </MDBCol>
                                        <MDBCol md='4' middle>
                                            <MDBRow className='mb-3 grey-text'>
                                                <MDBCol>
                                                    <Select
                                                        value={currentProductCategory}
                                                        className='form-control-md px-0'
                                                        isDisabled={true}
                                                    />
                                                </MDBCol>
                                            </MDBRow>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className='m-0 p-0'>
                                        {productViews}
                                    </MDBRow>
                                </form>
                            </MDBCol>
                        </MDBRow>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}

export default viewPriceGroupModal;
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
            priceGroupId: '',
            productCategory_id: '',
            productCategory: '',
            name: '',
            sellPrice: '',
            buyBackPrice: '',
            productCategories: [],
            productCategoryOptions: [],
            notificationMessage: '',
            notificationShow: false
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
                        productCategory_id: priceGroup.product_category_id,
                        sellPrice: priceGroup.sell_price,
                        buyBackPrice: priceGroup.buy_back_price,
                    })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllProductCategories')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                this.setProductCategoryOptions(json.data);
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
            if (productCategory.id.toString() === this.state.productCategory_id) {
                currentProductCategory = { label: productCategory.name, value: productCategory.id }
            }
        });
        this.setState({
            productCategoryOptions: productCategoryOptions, productCategory: currentProductCategory,
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = selectedOption => {
        this.setState({
            productCategory: selectedOption
        })

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
        else {
            let { priceGroupId, name, productCategory, sellPrice, buyBackPrice } = this.state

            console.log(priceGroupId, name, productCategory, sellPrice, buyBackPrice);

            let priceGroup = { id: priceGroupId, name: name, productCategory: productCategory, sellPrice: sellPrice, buyBackPrice: buyBackPrice }

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
        const { productCategory, productCategoryOptions } = this.state
        const customStyles = {
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
                                        {/* {showCategoryOptions ? */}
                                        <MDBRow className='mb-5 grey-text'>
                                            <MDBCol sm='2' className='pr-0 mr-0'>
                                                <MDBIcon icon="file-alt" size='2x' />
                                            </MDBCol>
                                            <MDBCol className='ml-0 pl-0'>
                                                <Select
                                                    styles={customStyles}
                                                    value={productCategory}
                                                    onChange={this.handleSelectChange}
                                                    options={productCategoryOptions}
                                                    placeholder='Product-Category'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-md'
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                        {/* : null} */}
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={this.state.sellPrice}
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
                                            value={this.state.buyBackPrice}
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
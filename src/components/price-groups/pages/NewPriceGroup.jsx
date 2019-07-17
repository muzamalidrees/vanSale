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
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ productCategories: json.data, showCategoryOptions: true })
                }
            })
            .catch((error) => console.log(error))



        this.state = {
            name: '',
            productCategory: '',
            sellPrice: '',
            buyBackPrice: '',
            productCategories: '',
            showCategoryOptions: false,
            notificationMessage: '',
            notificationShow: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = selectedOption => {
        this.setState({
            productCategory: selectedOption
        })
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
        else {

            let { name, productCategory, sellPrice, buyBackPrice } = this.state

            console.log(name, productCategory, sellPrice, buyBackPrice);

            let priceGroup = { name: name, productCategory: productCategory, sellPrice: sellPrice, buyBackPrice: buyBackPrice }

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
                            productCategory: '',
                            sellPrice: '',
                            buyBackPrice: '',

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

        const { productCategory, productCategories, showCategoryOptions } = this.state
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
        var CategoryOptions;
        if (showCategoryOptions) {

            CategoryOptions = productCategories.map(productCategory => ({ key: productCategory.id, label: productCategory.name, value: productCategory.id }));
        }


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
                                        {/* {showCategoryOptions ? */}
                                        <MDBRow className='mb-5 grey-text'>
                                            <MDBCol sm='1' className=''>
                                                <MDBIcon icon="th" size='2x' />
                                            </MDBCol>
                                            <MDBCol>
                                                <Select
                                                    styles={customStyles}
                                                    value={productCategory}
                                                    onChange={this.handleSelectChange}
                                                    options={CategoryOptions}
                                                    placeholder='Product-Category'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-md px-0'
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
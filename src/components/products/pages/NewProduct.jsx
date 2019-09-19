import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn,MDBAnimation, MDBInput, MDBCardBody, MDBIcon, MDBCardHeader, MDBCard } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class NewProduct extends Component {
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
            description: '',
            barcode: '',
            productCategory: '',
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
        let form = this.refs.newProductForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.productCategory === '' || this.state.productCategory === null) {
            this.setState({ productCategory: null })
            return
        }
        else {
            let { name, description, barcode, productCategory } = this.state

            // console.log(name, description, barcode, productCategory, productCategory.value);
            let product = {
                name: name, description: description, barcode: barcode,
                productCategoryId: productCategory.value
            }

            var options = {
                method: 'POST',
                body: JSON.stringify(product),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewProduct', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                        if (json.success === true) {
                            this.setState({
                                productCategory: '',
                                name: '',
                                barcode: '',
                                description: '',
                            })
                        }
                        else {
                            this.name.focus();
                        }
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
                borderColor: state.isFocused ?
                    '#ddd' : productCategory !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none'
            })
        }
        var CategoryOptions;
        // console.log(productCategories);

        if (showCategoryOptions) {
            CategoryOptions = productCategories.map(productCategory => ({
                key: productCategory.id, label: productCategory.name, value: productCategory.id
            }));
        }


        return (
            <Can I='create' a='product'>
                <MDBContainer className='' style={{ marginTop: '80px' }}>
                    <MDBRow center>
                        <MDBCol md="6">
                            <MDBCard className=' p-5'>

                                <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                    New Product
                            </MDBCardHeader>
                                <MDBCardBody className='p-2'>

                                    <form ref='newProductForm' onSubmit={this.handleSubmit} noValidate>
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
                                                inputRef={el => { this.name = el }}
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.description}
                                                label="Description"
                                                name="description"
                                                icon="file-alt"
                                                group
                                                type="textarea"
                                                rows='1'
                                                validate
                                                error="wrong"
                                                success="right"
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.barcode}
                                                label="Barcode"
                                                name="barcode"
                                                icon="barcode"
                                                group
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                            />
                                            <MDBRow className='mb-5'>
                                                <MDBCol sm='1' className=''>
                                                    <MDBIcon icon="th" size='2x' />
                                                </MDBCol>
                                                <MDBCol className=''>
                                                    {/* {showOptions ? */}
                                                    <Select
                                                        styles={customStyles}
                                                        value={productCategory}
                                                        onChange={this.handleSelectChange}
                                                        options={CategoryOptions}
                                                        placeholder='Category'
                                                        isSearchable
                                                        isClearable
                                                        className='form-control-md pl-0'
                                                    >
                                                    </Select>
                                                    {/* : null */}
                                                    {/* } */}
                                                </MDBCol>
                                            </MDBRow>
                                        </div>
                                        <div className="text-center">
                                            <MDBBtn size='sm' color="dark" outline type='submit'>Submit</MDBBtn>
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
                </MDBContainer>
            </Can>
        );
    }
}


export default NewProduct
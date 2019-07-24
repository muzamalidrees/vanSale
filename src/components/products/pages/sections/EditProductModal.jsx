import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBCol, MDBIcon, MDBModalBody, MDBCard, MDBCardBody, MDBModalHeader, MDBRow, MDBInput } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../../misc/sections/Notification';



class EditProductModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            productId: '',
            productCategory_id: '',
            productCategory: '',
            name: '',
            description: '',
            barCode: '',
            productCategories: '',
            productCategoryOptions: [],
            notificationMessage: '',
            notificationShow: false
        }
    }
    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificProduct/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                let product = json.data
                if (this._isMounted === true) {
                    this.setState({
                        productId: product.id,
                        name: product.name,
                        description: product.description,
                        barCode: product.barCode,
                        productCategory_id: product.product_category_id,

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
        let productCategoryOptions = productCategories.map(productCategory => ({
            key: productCategory.id, label: productCategory.name, value: productCategory.id
        }));
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
        let form = this.refs.updateProductForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.productCategory === '' || this.state.productCategory === null) {
            this.setState({ productCategory: null })
            return
        }
        else {
            let { productId, name, description, barCode, productCategory } = this.state
            console.log(productId, name, description, barCode, productCategory);

            let product = {
                id: productId, name: name, description: description,
                barCode: barCode, productCategory: productCategory.value
            }

            var options = {
                method: 'PUT',
                body: JSON.stringify(product),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/updateProduct', options)
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


        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='md' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit Product Details</MDBModalHeader>
                    <MDBModalBody>

                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>

                                <form ref='updateProductForm' onSubmit={this.handleSubmit} noValidate>
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
                                            value={this.state.barCode}
                                            label="Barcode"
                                            name="barCode"
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
                                                    options={productCategoryOptions}
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
                                    <div className='text-center'>

                                        <MDBBtn size='sm' className=' font-weight-bold' color="dark" onClick={this.toggle}>Close</MDBBtn>
                                        <MDBBtn size='sm' className=' font-weight-bold' onClick={this.handleSubmit} outline color="dark">Save updates</MDBBtn>
                                    </div>
                                </form>
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

export default EditProductModal;
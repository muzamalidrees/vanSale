import React, { Component } from 'react';
import { MDBInput, MDBBtn, MDBRow, MDBCol, MDBContainer, MDBCard, MDBCardBody, MDBCardHeader } from 'mdbreact';
import Select from 'react-select';
import { Can } from '../../../configs/Ability-context'



class NewTransaction extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this._isMounted = true

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data, showOptions: true })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            rate: '',
            qty: '',
            product: '',
            products: [],
            showOptions: false,
        }
        this.handleProductSubmit = this.handleProductSubmit.bind(this)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = selectedOption => {

        this.setState({
            product: selectedOption
        })
        this.setProductRate(selectedOption.value)
    }

    onKeyPress = (e) => {
        if ((e.which) === 101 || (e.which) === 45) e.preventDefault();
    }

    handleScanProduct = () => {

    }

    setProductRate = (pId) => {
        const { products } = this.state;
        const product = products.filter((product) => product.id == pId).shift()
        this.setState({ rate: product.price })
    }

    handleProductSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.productDetailsForm;
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        // else if (this.state.product === '' || this.state.product === null) {
        //     this.setState({ product: null })
        //     return
        // }
        // else if (this.refs.customerSelect === undefined) {
        //     if (this.state.driver === '' || this.state.driver === null) {
        //         this.setState({ driver: null })
        //         return
        //     }
        // }
        // else if (this.state.customer === '' || this.state.customer === null) {
        //     this.setState({ customer: null })
        //     return
        // }
        else {
            let pId = this.state.product.value;
            let pName = this.state.product.label;
            let pRate = this.state.rate;
            let pQTY = this.state.qty
            let pPrice = this.price.value;
            let tableId = this.props.tableId
            // console.log(pId, pRate, pQTY, pPrice, trDate);

            this.props.addProductToTbl(tableId, pId, pName, pRate, pQTY, pPrice);
            document.getElementById(`${this.props.containerId}`).style.display = '';
            this.setState({
                product: '',
                rate: '',
                qty: '',
            })
        }
    }



    render() {
        var { rate, qty, product, products, showOptions } = this.state

        const productStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : product !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
            })
        }
        var productOptions;
        if (showOptions) {

            productOptions = products.map(product => ({
                key: product.id, label: product.name, value: product.id
            }));
        }



        return (
            <MDBContainer className='' fluid style={{}}>
                <MDBRow center>
                    <MDBCol>
                        <MDBCard className=' p-2'>
                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                New {this.props.tableId === 'saleProductsTable' ? 'Sales' : 'Returns'}
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>
                                <form ref='productDetailsForm' onSubmit={this.handleProductSubmit} noValidate >
                                    {/* <fieldset className='legend-border'>
                                        <legend className='legend-border'></legend> */}
                                    <MDBRow className=' p-0'>
                                        <MDBCol lg='3' className='3' middle >
                                            <Select
                                                styles={productStyles}
                                                value={product}
                                                onChange={this.handleSelectChange}
                                                options={productOptions}
                                                placeholder='Product'
                                                isSearchable
                                                isClearable
                                                className='form-control-md'
                                            >
                                            </Select>
                                        </MDBCol>
                                        <Can I='scan' a='product'>
                                            <MDBCol lg='1' className='text-center' middle >
                                                <MDBBtn
                                                    size='sm'
                                                    color="dark"
                                                    className='font-weight-bold form-control ml-0 px-0'
                                                    style={{ fontSize: '12px', borderRadius: '5px' }}
                                                    onClick={this.handleScanProduct}
                                                >
                                                    Scan
                                                    </MDBBtn>
                                            </MDBCol>
                                        </Can>
                                        <MDBCol size='lg' className=''>
                                            <MDBInput
                                                type='number'
                                                value={rate}
                                                label='Rate'
                                                name='rate'
                                                onInput={this.handleInput}
                                                outline required
                                                onKeyPress={this.onKeyPress}
                                            />

                                        </MDBCol>
                                        <MDBCol size='lg' className=''   >
                                            <MDBInput
                                                type='number'
                                                value={qty}
                                                label='Qty.'
                                                name='qty'
                                                onInput={this.handleInput}
                                                outline required
                                                onKeyPress={this.onKeyPress}
                                            />

                                        </MDBCol>
                                        <MDBCol size='lg' className=''>
                                            <MDBInput
                                                type='number'
                                                value={rate * qty}
                                                inputRef={el => this.price = el}
                                                label='Price'
                                                outline
                                                disabled
                                            />
                                        </MDBCol>
                                        <MDBCol size='lg' middle className=' text-center'>
                                            <MDBBtn
                                                size='sm'
                                                color="dark"
                                                className='font-weight-bold form-control ml-0'
                                                style={{ fontSize: '12px', borderRadius: '5px' }}
                                                type='submit'
                                                outline
                                            >
                                                Add Product
                                                    </MDBBtn>
                                        </MDBCol>
                                    </MDBRow>
                                    {/* </fieldset> */}
                                </form >
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}


export default NewTransaction
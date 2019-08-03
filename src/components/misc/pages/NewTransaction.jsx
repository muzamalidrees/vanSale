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
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data, showOptions: true })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllCustomerPrices')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ customerPrices: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllPriceGroups')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ priceGroups: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllProductPrices')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ productPrices: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            rate: '',
            qty: '',
            product: '',
            products: [],
            customerPrices: [],
            priceGroups: [],
            productPrices: [],
        }
        this.handleProductSubmit = this.handleProductSubmit.bind(this)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    //enabling add product button and setting validating label empty
    enableAddProductBtn = () => {
        this.message.innerHTML = ''
        this.addProductBtn.disabled = false
        this.addProductBtn.classList.remove('disabled')
    }

    //disabling add product button and setting validating label value
    disableAddProductBtn = () => {
        this.message.innerHTML = 'Please select customer first.'
        this.addProductBtn.disabled = true
        this.addProductBtn.classList.add('disabled')
    }

    //handling changing inputs
    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //handling product change
    handleSelectChange = selectedOption => {

        this.setState({
            product: selectedOption
        })

        if (selectedOption !== null) {
            this.setProductRate(selectedOption.value)
        }
    }

    //assuring only numbers allowed in input type=number s.
    onKeyPress = (e) => {
        if ((e.which) === 101 || (e.which) === 45) e.preventDefault();
    }

    //handling scanning products
    handleScanProduct = () => {

    }

    //setting product rate on selecting products
    setProductRate = (pId) => {
        let { customerId, tableId } = this.props
        let { customerPrices, products, priceGroups, productPrices } = this.state

        //checking if customer is selected or not
        if (customerId === '') {
            this.message.innerHTML = 'Please select a customer first.'
            this.setState({ product: '' })
        }
        else {
            let customerPriceGroups = [];
            let productCategory

            //finding all price-groups assidned to customer
            let customerAllPrices = customerPrices
                .filter(customerPrice => customerPrice.customer_id === customerId);

            //getting customer's price-groups' data
            customerAllPrices.forEach(customerPrice => {
                let a = priceGroups.filter(priceGroup => priceGroup.id === customerPrice.price_group_id)
                let priceGroup = a.shift()
                customerPriceGroups.push(priceGroup)
            });

            //finding selected product's category
            products.forEach(product => {
                if (product.id === pId) {
                    productCategory = product.product_category_id;
                }
            });

            //finding price-group that holds this productCategory from customer's price-groups
            let desiredPriceGroup = customerPriceGroups.filter(priceGroup => priceGroup.product_category_id === productCategory)
            console.log(desiredPriceGroup);

            //finding prices
            let productPrice = productPrices.filter(productPrice =>
                productPrice.price_group_id === desiredPriceGroup.id && productPrice.product_id === pId
            )
            console.log(productPrice);

            //setting selling and returning rates
            if (tableId === 'saleProductsTable') {
                this.setState({ rate: productPrice.sell_price })
            }
            else {
                this.setState({ rate: productPrice.buy_back_price })
            }
        }
    }

    //adding product to table
    handleProductSubmit = (e) => {

        //preventing default behaviour of form submit
        e.preventDefault();

        //checking form validity
        let form = this.refs.productDetailsForm;
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.product === '' || this.state.product === null) {
            this.setState({ product: null })
            return
        }
        else if (this.state.customer === '' || this.state.customer === null) {
            this.setState({ customer: null })
            return
        }

        //checking product's qty in stock
        else if (this.props.tableId === 'saleProductsTable') {
            let driver = this.props.driverId
            let checkQty = { driver: driver, product: this.state.product.value }
            let options = {
                method: 'GET',
                body: JSON.stringify(checkQty),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/checkDriverItemQty', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    let stock = json.qty;
                    if (this.state.qty > stock) {
                        alert("Maximum Available Qty of " + this.state.product.label + " is: " + stock)
                        this.refs.qty.focus();
                        return;
                    }
                })
                .catch((error) => console.log(error))
        }

        // adding product to table
        else {
            let pId = this.state.product.value;
            let pName = this.state.product.label;
            let pRate = this.state.rate;
            let pQTY = this.state.qty
            let pPrice = this.price.value;
            let tableId = this.props.tableId
            // console.log(pId, pRate, pQTY, pPrice, trDate);

            this.props.addProductToTbl(tableId, pId, pName, pRate, pQTY, pPrice);

            //setting table display.
            document.getElementById(`${this.props.containerId}`).style.display = '';

            // setting form again empty
            this.setState({
                product: '',
                rate: '',
                qty: '',
            })
        }
    }



    render() {
        var { rate, qty, product, products, showOptions } = this.state

        //setting product select styles
        const productStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : product !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
            })
        }

        //setting product options
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
                                                ref='qty'
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
                                        <MDBCol size='lg' className=''>
                                            <label style={{ color: 'red' }} className='mb-0 p-0' ref={el => this.message = el}></label>
                                            <MDBBtn
                                                // id='addProductbtn'
                                                innerRef={el => this.addProductBtn = el}
                                                size='sm'
                                                color="dark"
                                                className='font-weight-bold form-control ml-0 '
                                                style={{ fontSize: '13px', borderRadius: '5px', marginTop: '1px' }}
                                                type='submit'
                                                outline
                                                disabled
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
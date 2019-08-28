import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBCardHeader, MDBInput } from 'mdbreact'
import Select from 'react-select';
import Notification from '../../misc/sections/Notification'
import { Can } from '../../../configs/Ability-context'



class NewInventory extends Component {
    _isMounted = false
    constructor() {
        super();
        this.state = {
            to: 'Driver',
            driver: '',
            operator: '',
            product: '',
            qty: '',
            users: [],
            roles: '',
            products: [],
            notificationShow: false,
            notificationMessage: '',
        };

        this._isMounted = true
        fetch('/getAllUsers')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ users: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllRoles')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ roles: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data })
                }
            })
            .catch((error) => console.log(error))
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    toggle = () => {
        this.setState({
            to: this.state.to === 'Driver' ? 'Operator' : 'Driver'
        })
    }

    handleSelectChange = name => selectedOption => {
        this.setState({
            [name]: selectedOption
        })
    }

    //assuring only numbers allowed in input type=number s.
    onKeyPress = (e) => {
        if ((e.which) === 101 || (e.which) === 45) e.preventDefault();
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.inventoryForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.to === 'Driver') {

            if (this.state.driver === '' || this.state.driver === null) {
                this.setState({ driver: null })
                return
            }
            else if (this.state.product === '' || this.state.product === null) {
                this.setState({ product: null })
                return
            }
            else {
                this.checkQty(this.state.product, this.state.qty);
            }
        }
        else if (this.state.to === 'Operator') {
            if (this.state.operator === '' || this.state.operator === null) {
                this.setState({ operator: null })
                return
            }
            else if (this.state.product === '' || this.state.product === null) {
                this.setState({ product: null })
                return
            }
            else {
                let { operator, product, qty } = this.state
                // console.log(driver, operator, to, product, qty);
                let operatorInventory = {
                    operatorId: operator.value, productId: product.value, qty: qty
                }

                var options = {
                    method: 'POST',
                    body: JSON.stringify(operatorInventory),
                    headers: { 'Content-Type': 'application/json' }
                }
                fetch('/addNewLocationInventory', options)
                    .then((res) => res.json())
                    .then((json) => {
                        // console.log(json)
                        if (this._isMounted === true) {
                            this.setState({ notificationMessage: json.message, notificationShow: true })
                        }
                        if (json.success === true) {
                            this.setState({
                                operator: '',
                                product: '',
                                qty: ''
                            })
                        }
                        if (this._isMounted === true) {
                            setTimeout(() => this.setState({ notificationShow: false }), 1502);
                        }
                    })
                    .catch((error) => console.log(error))

                let history = {
                    customerId: 0, driverId: 0, operatorId: operator.value,
                    productId: product.value, qty: qty, flag: 'FTO'
                }
                var historyOptions = {
                    method: 'POST',
                    body: JSON.stringify(history),
                    headers: { 'Content-Type': 'application/json' }
                }
                fetch('/addNewInventoryHistory', historyOptions)
                    .then((res) => res.json())
                    .then((json) => {
                        // console.log(json)
                    })
                    .catch((error) => console.log(error))
            }
        }
    }

    checkQty = (product, qty) => {
        let operatorId = Number(localStorage.getItem('ui'))
        let checkQty = { operatorId: operatorId, productId: product.value }
        // console.log(checkQty);

        let options = {
            method: 'POST',
            body: JSON.stringify(checkQty),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/checkLocationItemQty', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                let stock = json.qty;
                if (qty > stock) {
                    alert("Maximum Available Qty of " + product.label + " is: " + stock)
                    this.qty.focus();
                    return;
                }
                else {
                    this.addNewDriverInventory();
                }
            })
            .catch((error) => console.log(error))
    }

    addNewDriverInventory = () => {
        let { driver, product, qty } = this.state
        let driverInventory = {
            driverId: driver.value, productId: product.value, qty: qty
        }

        var options = {
            method: 'POST',
            body: JSON.stringify(driverInventory),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/addNewDriverInventory', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted === true) {
                    this.setState({ notificationMessage: json.message, notificationShow: true })
                }
                if (json.success === true) {
                    this.setState({
                        driver: '',
                        product: '',
                        qty: ''
                    })
                }
                if (this._isMounted === true) {
                    setTimeout(() => this.setState({ notificationShow: false }), 1502);
                }
            })
            .catch((error) => console.log(error))


        let operatorInventory = {
            operatorId: Number(localStorage.getItem('ui')), productId: product.value, qty: qty
        }
        let options2 = {
            method: 'PUT',
            body: JSON.stringify(operatorInventory),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/decreaseLocationInventory', options2)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
            })
            .catch((error) => console.log(error))


        let history = {
            customerId: 0, driverId: driver.value, operatorId: Number(localStorage.getItem('ui')),
            productId: product.value, qty: qty, flag: 'OTD'
        }
        let historyOptions = {
            method: 'POST',
            body: JSON.stringify(history),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/addNewInventoryHistory', historyOptions)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
            })
            .catch((error) => console.log(error))
    }

    render() {
        let { users, roles, products, driver, operator, product, to } = this.state
        const driverStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : driver !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none'
            })
        }
        const operatorStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : operator !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none'
            })
        }
        const productStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : product !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none'
            })
        }
        let driverRoleId, operatorRoleId;
        var driverOptions, operatorOptions, productOptions;

        if (roles !== '' && roles !== null && roles !== undefined) {
            roles.forEach(role => {
                if (role.name === 'driver') {
                    driverRoleId = role.id
                }
                else if (role.name === 'operator') {
                    operatorRoleId = role.id
                }
            })
        }

        let drivers = users.filter(user => user.role_id === driverRoleId)
        let operators = users.filter(user => user.role_id === operatorRoleId)
        driverOptions = drivers.map(driver => ({ key: driver.id, label: driver.name, value: driver.id }));
        operatorOptions = operators.map(operator => ({ key: operator.id, label: operator.name, value: operator.id }));
        productOptions = products.map(product => ({ key: product.id, label: product.name, value: product.id }));


        return (
            <Can I='allocate' a='driverInventory'>
                <MDBContainer className='mt-5 pt-3'>
                    <div className='row mt-2'>
                        <MDBCardHeader tag="h4" style={{ color: 'dark', width: '100%' }} className="text-center font-weight-bold">
                            Allocate inventory to {to}
                        </MDBCardHeader>
                        <MDBRow center style={{ width: '100%' }} className='m-1 p-1'>
                            <MDBCol md='6' className='grey-text m-3 pt-5'>
                                <form ref='inventoryForm' onSubmit={this.handleSubmit} noValidate>
                                    <MDBRow className='mb-5'>
                                        <MDBCol sm='1' className=''>
                                            <MDBIcon icon="user-tie" size='2x' />
                                        </MDBCol>
                                        <MDBCol className=''>
                                            {to === 'Driver' ?
                                                <Select
                                                    styles={driverStyles}
                                                    value={driver}
                                                    onChange={this.handleSelectChange('driver')}
                                                    options={driverOptions}
                                                    placeholder='Driver'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-md pl-0'
                                                >
                                                </Select>
                                                :
                                                <Select
                                                    styles={operatorStyles}
                                                    value={operator}
                                                    onChange={this.handleSelectChange('operator')}
                                                    options={operatorOptions}
                                                    placeholder='Operator'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-md pl-0'
                                                >
                                                </Select>
                                            }
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className='mb-5'>
                                        <MDBCol sm='1' className=''>
                                            <MDBIcon icon="box-open" size='2x' />
                                        </MDBCol>
                                        <MDBCol className=''>
                                            {/* {showOptions ? */}
                                            <Select
                                                styles={productStyles}
                                                value={product}
                                                onChange={this.handleSelectChange('product')}
                                                options={productOptions}
                                                placeholder='Product'
                                                isSearchable
                                                isClearable
                                                className='form-control-md pl-0'
                                            >
                                            </Select>
                                            {/* : null */}
                                            {/* } */}
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBInput
                                        onInput={this.handleInput}
                                        value={this.state.qty}
                                        label="Qty."
                                        name="qty"
                                        icon="sort-numeric-down"
                                        group
                                        inputRef={el => this.qty = el}
                                        onKeyPress={this.onKeyPress}
                                        type="number"
                                        validate
                                        required
                                    />
                                    <div className="text-center">
                                        <MDBBtn size='sm' color="dark" type='submit' style={{ letterSpacing: '3px' }}>Allocate</MDBBtn>
                                    </div>
                                    <Can I='allocate' a='operatorInventory'>
                                        <MDBCol className='text-center'>
                                            <MDBBtn size='sm' style={{ letterSpacing: '3px' }} className='' color='info ' onClick={this.toggle} >
                                                Click here to allocate inventory to {to === 'Driver' ? 'Operator' : 'Driver'}
                                            </MDBBtn>
                                        </MDBCol>
                                    </Can>
                                    {
                                        this.state.notificationShow ?
                                            <div className=''>
                                                <Notification
                                                    message={this.state.notificationMessage}
                                                />
                                            </div>
                                            :
                                            null
                                    }
                                </form>
                            </MDBCol>
                        </MDBRow>
                    </div>
                </MDBContainer>
            </Can>
        )
    }
}


export default NewInventory
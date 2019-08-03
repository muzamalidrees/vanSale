import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBCard, MDBCardBody, MDBModalHeader, MDBModalFooter, MDBInput, MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../../misc/sections/Notification';



class EditInventoryModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            inventoryType: '',
            driver: '',
            operator: '',
            product: '',
            qty: '',
            users: [],
            roles: [],
            driverOptions: [],
            operatorOptions: [],
            productOptions: [],
            notificationMessage: '',
            notificationShow: false
        }
    }
    fetchData = (id, canA) => {
        this._isMounted = true
        if (canA === 'driverInventory') {
            fetch('/getSpecificDriverInventory/' + id)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    var inventory = json.data
                    if (this._isMounted === true) {
                        this.setState({
                            inventory: inventory,
                            qty: inventory.qty,
                            inventoryType: canA
                        })
                    }
                })
                .catch((error) => console.log(error))
        }
        else {
            fetch('/getSpecificLocationInventory/' + id)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    var inventory = json.data
                    if (this._isMounted === true) {
                        this.setState({
                            inventory: inventory,
                            qty: inventory.qty,
                            inventoryType: canA
                        })
                    }
                })
                .catch((error) => console.log(error))
        }

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
                this.setUserOptions(json.data);
            })
            .catch((error) => console.log(error))


        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
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

    setUserOptions = (roles) => {
        let { users, inventory, inventoryType } = this.state

        if (inventoryType === 'driverInventory') {
            let driverRoleId, driverOptions, drivers, currentDriver;
            if (roles !== '' && roles !== null && roles !== undefined) {
                roles.forEach(role => {
                    if (role.name === 'driver') {
                        driverRoleId = role.id
                    }
                })
            }
            drivers = users.filter(user => user.role_id === driverRoleId)
            driverOptions = drivers.map(driver => ({ key: driver.id, label: driver.name, value: driver.id }));
            drivers.forEach(driver => {
                if (driver.id === inventory.driver_id) {
                    currentDriver = { label: driver.name, value: driver.id }
                }
            });
            this.setState({
                driverOptions: driverOptions,
                driver: currentDriver
            })
        }
        else {
            let operatorRoleId, operatorOptions, operators, currentOperator;
            if (roles !== '' && roles !== null && roles !== undefined) {
                roles.forEach(role => {
                    if (role.name === 'operator') {
                        operatorRoleId = role.id
                    }
                })
            }
            operators = users.filter(user => user.role_id === operatorRoleId)
            operatorOptions = operators.map(operator => ({ key: operator.id, label: operator.name, value: operator.id }));
            operators.forEach(operator => {
                if (operator.id === inventory.operator_id) {
                    currentOperator = { label: operator.name, value: operator.id }
                }
            });
            this.setState({
                operatorOptions: operatorOptions,
                operator: currentOperator
            })
        }
    }

    setProductOptions = (products) => {

        let productOptions, currentProduct;
        if (products !== '' && products !== null && products !== undefined) {
            products.forEach(product => {
                if (product.id === this.state.inventory.product_id) {
                    currentProduct = { label: product.name, value: product.id }
                }
            })
        }
        productOptions = products.map(product => ({ key: product.id, label: product.name, value: product.id }));
        this.setState({
            product: currentProduct,
            productOptions: productOptions
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //assuring only numbers allowed in input type=number s.
    onKeyPress = (e) => {
        if ((e.which) === 101 || (e.which) === 45) e.preventDefault();
    }

    handleSelectChange = name => selectedOption => {
        this.setState({
            [name]: selectedOption
        })

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.updateInventoryForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.inventoryType === 'driverInventory') {

            if (this.state.driver === '' || this.state.driver === null) {
                this.setState({ driver: null })
                return
            }
            else if (this.state.product === '' || this.state.product === null) {
                this.setState({ product: null })
                return
            }
            else {
                let { inventory, driver, product, qty } = this.state
                // console.log(driver, operator, to, product, qty);

                let driverInventory = {
                    id: inventory.id, driverId: driver.value, productId: product.value, qty: qty
                }

                var options = {
                    method: 'PUT',
                    body: JSON.stringify(driverInventory),
                    headers: { 'Content-Type': 'application/json' }
                }
                fetch('/updateDriverInventory', options)
                    .then((res) => res.json())
                    .then((json) => {
                        console.log(json)
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
            }
        }

        else if (this.state.inventoryType === 'operatorInventory') {
            if (this.state.operator === '' || this.state.operator === null) {
                this.setState({ operator: null })
                return
            }
            else if (this.state.product === '' || this.state.product === null) {
                this.setState({ product: null })
                return
            }
            else {
                let { inventory, operator, product, qty } = this.state
                // console.log(driver, operator, to, product, qty);

                let operatorInventory = {
                    id: inventory.id, operatorId: operator.value, productId: product.value, qty: qty
                }

                var options = {
                    method: 'POST',
                    body: JSON.stringify(operatorInventory),
                    headers: { 'Content-Type': 'application/json' }
                }
                fetch('/updateLocationInventory', options)
                    .then((res) => res.json())
                    .then((json) => {
                        console.log(json)
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
            }
        }
    }





    render() {
        let { driverOptions, operator, operatorOptions, driver, qty, inventoryType, product, productOptions } = this.state

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



        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='md' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit {this.stat} Inventory</MDBModalHeader>
                    <MDBModalBody>

                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>

                                <form ref='updateInventoryForm' onSubmit={this.handleSubmit} noValidate>
                                    <MDBRow className='mb-5'>
                                        <MDBCol sm='1' className=''>
                                            <MDBIcon icon="user-tie" size='2x' />
                                        </MDBCol>
                                        <MDBCol className=''>
                                            {inventoryType === 'driverInventory' ?
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
                                            <MDBIcon icon="user-tie" size='2x' />
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
                                        value={qty}
                                        label="Qty."
                                        name="qty"
                                        icon="sort-numeric-down"
                                        group
                                        onKeyPress={this.onKeyPress}
                                        type="number"
                                        validate
                                        required
                                    />
                                    <div className="text-center">
                                        <MDBBtn size='sm' color="dark" type='submit'>Update</MDBBtn>
                                    </div>
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
                            </MDBCardBody>
                        </MDBCard>
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default EditInventoryModal;
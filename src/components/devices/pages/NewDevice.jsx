import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard, MDBIcon } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class NewDevice extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllUsers')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                let users = json.data;
                let drivers = users.filter(user => user.role_id === 3)
                if (this._isMounted) {
                    this.setState({ drivers: drivers })
                }
            })
            .catch((error) => console.log(error))



        this.state = {
            driver: '',
            IMEI: '',
            drivers: '',
            showOptions: false,
            notificationMessage: '',
            notificationShow: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = selectedOption => {
        this.setState({
            driver: selectedOption
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.newDeviceForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.driver === '' || this.state.driver === null) {
            this.setState({ driver: null })
            return
        }
        else {
            let { driver, IMEI } = this.state;

            console.log(driver.value, IMEI);
            let device = { IMEI: IMEI, driverId: driver.value }

            var options = {
                method: 'POST',
                body: JSON.stringify(device),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewDevice', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            driver: '',
                            IMEI: '',
                        })
                    }
                    else {
                        this.IMEI.focus();
                    }
                    if (this._isMounted === true) {
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);

                    }
                })
                .catch((error) => console.log(error))
        }
    }

    render() {

        const { driver, drivers, showOptions } = this.state
        const customStyles = {
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
        var driverOptions;
        if (showOptions) {
            driverOptions = drivers.map(driver => ({ key: driver.id, label: driver.name, value: driver.id }));
        }


        return (
            // <Can I='create' a='device'>
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="6">
                        <MDBCard className='p-3'>

                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                New Device
                            </MDBCardHeader>
                            <MDBCardBody className='p-4'>

                                <form ref='newDeviceForm' onSubmit={this.handleSubmit} noValidate>
                                    <div className="grey-text">
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={this.state.IMEI}
                                            label="IMEI"
                                            name="IMEI"
                                            inputRef={el => { this.IMEI = el }}
                                            icon="barcode"
                                            group
                                            type="text"
                                            validate
                                            required
                                        />
                                        <MDBRow className='mb-5'>
                                            <MDBCol sm='1' className=''>
                                                <MDBIcon icon="user-tie" size='2x' />
                                            </MDBCol>
                                            <MDBCol className=''>
                                                {/* {showOptions ? */}
                                                <Select
                                                    styles={customStyles}
                                                    value={driver}
                                                    onChange={this.handleSelectChange}
                                                    options={driverOptions}
                                                    placeholder='Driver'
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
                                        <MDBBtn size='sm' color="dark" outline type='submit'>Register</MDBBtn>
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
            // </Can >
        );
    }
}


export default NewDevice
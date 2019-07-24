import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBCard, MDBCardBody, MDBModalHeader, MDBModalFooter, MDBInput, MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../../misc/sections/Notification';



class EditDeviceModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            deviceId: '',
            IMEI: '',
            driver_id: '',
            driver: '',
            drivers: '',
            driverOptions: [],
            notificationMessage: '',
            notificationShow: false
        }
    }
    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificDevice/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                var device = json.data
                if (this._isMounted === true) {
                    this.setState({
                        deviceId: device.id,
                        driver_id: device.driver_id,
                        IMEI: device.IMEI,
                    })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllDrivers')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                this.setDriverOptions(json.data);
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

    setDriverOptions = (drivers) => {
        let driverOptions = drivers.map(driver => ({ key: driver.id, label: driver.name, value: driver.id }));
        let currentDriver;
        drivers.forEach(driver => {
            if (driver.id.toString() === this.state.driver_id) {
                currentDriver = { label: driver.name, value: driver.id }
            }
        });
        this.setState({
            driverOptions: driverOptions, driver: currentDriver,
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = selectedOption => {
        this.setState({
            driver: selectedOption
        })

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.updateDriverForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.driver === '' || this.state.driver === null) {
            this.setState({ driver: null })
            return
        }
        else {
            let { deviceId, IMEI, driver } = this.state
            console.log(deviceId, IMEI, driver);

            let device = { id: deviceId, IMEI: IMEI, driverId: driver.value }

            var options = {
                method: 'PUT',
                body: JSON.stringify(device),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/updateDevice', options)
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
        const { driver, driverOptions } = this.state
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


        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='md' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit Device Details</MDBModalHeader>
                    <MDBModalBody>

                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>

                                <form ref='updateDriverForm' onSubmit={this.handleSubmit} noValidate>
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
                                    <div className='text-right'>

                                        <MDBBtn size='sm' className=' font-weight-bold' color="dark" onClick={this.toggle}>Close</MDBBtn>
                                        <MDBBtn size='sm' className=' font-weight-bold' onClick={this.handleSubmit} outline color="dark">Save updates</MDBBtn>
                                    </div>
                                </form>
                            </MDBCardBody>
                            {
                                this.state.notificationShow ?
                                    <Notification
                                        message={this.state.message}
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

export default EditDeviceModal;
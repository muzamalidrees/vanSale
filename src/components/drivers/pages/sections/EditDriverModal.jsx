import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBCard, MDBCardBody, MDBModalHeader, MDBRow, MDBCol, MDBIcon, MDBInput } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../../misc/sections/Notification';



class EditDriverModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            driverId: '',
            route_id: '',
            route: '',
            name: '',
            email: '',
            cell: '',
            address: '',
            driver_id: '',
            dailyMessage: '',
            routes: '',
            routeOptions: [],
            notificationMessage: '',
            notificationShow: false
        }
    }
    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificDriver/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                var driver = json.data
                if (this._isMounted === true) {
                    this.setState({
                        driverId: driver.id,
                        route_id: driver.route_id,
                        name: driver.name,
                        email: driver.email,
                        cell: driver.cell,
                        address: driver.address,
                        dailyMessage: driver.daily_message,
                        driver_id: driver.driver_id
                    })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllRoutes')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                this.setRouteOptions(json.data);
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

    setRouteOptions = (routes) => {
        let routeOptions = routes.map(route => ({ key: route.id, label: route.name, value: route.id }));
        let currentRoute;
        routes.forEach(route => {
            if (route.id.toString() === this.state.route_id) {
                currentRoute = { label: route.name, value: route.id }
            }
        });
        this.setState({
            routeOptions: routeOptions, route: currentRoute,
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = selectedOption => {
        this.setState({
            route: selectedOption
        })

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.updateDriverForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.route === '' || this.state.route === null) {
            this.setState({ route: null })
            return
        }
        else {
            let { driverId, name, email, cell, address, dailyMessage, driver_id, route } = this.state
            console.log(driverId, name, email, cell, address, dailyMessage, driver_id, route.value);

            let driver = {
                id: driverId, name: name, email: email, cell: cell, address: address,
                dailyMessage: dailyMessage, driver_id: driver_id, route: route.value
            }

            var options = {
                method: 'PUT',
                body: JSON.stringify(driver),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/updateDriver', options)
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
        const { route, routeOptions } = this.state
        const customStyles = {
            control: (base, state) => ({
                ...base,
                borderBottomColor: state.isFocused ?
                    '#ddd' : route !== null ?
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
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit Driver Details</MDBModalHeader>
                    <MDBModalBody>

                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>

                                <form ref='updateDriverForm' onSubmit={this.handleSubmit} noValidate>
                                    <MDBRow around className="grey-text">
                                        <MDBCol md="5">
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.driver_id}
                                                label="Id."
                                                name="driver_id"
                                                icon="id-card"
                                                inputRef={el => { this.driver_id = el }}
                                                group
                                                type="text"
                                                validate
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.name}
                                                label="Name"
                                                name='name'
                                                icon="user"
                                                group
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.email}
                                                label="Email"
                                                name="email"
                                                icon="envelope"
                                                group
                                                type="email"
                                                validate
                                                error="wrong"
                                                success="right"
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.cell}
                                                label="Phone"
                                                name="cell"
                                                icon="phone"
                                                group
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                            />
                                        </MDBCol>
                                        <MDBCol md="5">
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.address}
                                                label="Address"
                                                name="address"
                                                icon="map-marker-alt"
                                                group
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.dailyMessage}
                                                label="Daily Message"
                                                name="dailyMessage"
                                                icon="file-invoice"
                                                group
                                                type="textarea"
                                                rows='1'
                                                validate
                                            />
                                            <MDBRow className='mb-5'>
                                                <MDBCol sm='2' className=''>
                                                    <MDBIcon icon="route" size='2x' />
                                                </MDBCol>
                                                <MDBCol className=''>
                                                    {/* {showOptions ? */}
                                                    <Select
                                                        styles={customStyles}
                                                        value={route}
                                                        onChange={this.handleSelectChange}
                                                        options={routeOptions}
                                                        placeholder='Route'
                                                        isSearchable
                                                        isClearable
                                                        className='form-control-md pl-0'
                                                    >
                                                    </Select>
                                                    {/* : null */}
                                                    {/* } */}
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow around>
                                                <MDBBtn size='sm' className=' mt-4 font-weight-bold' color="dark" onClick={this.toggle}>Close</MDBBtn>
                                                <MDBBtn size='sm' className=' mt-4 font-weight-bold' onClick={this.handleSubmit} outline color="dark">Save updates</MDBBtn>
                                            </MDBRow>
                                        </MDBCol>
                                    </MDBRow>
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

export default EditDriverModal;
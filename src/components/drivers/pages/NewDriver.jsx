import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard, MDBIcon } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class NewDriver extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllRoutes')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ routes: json.data, showOptions: true })
                }
            })
            .catch((error) => console.log(error))



        this.state = {
            driver_id: '',
            name: '',
            email: '',
            cell: '',
            address: '',
            route: '',
            dailyMessage: '',
            routes: '',
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
            route: selectedOption
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.newDriverForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else if (this.state.route === '' || this.state.route === null) {
            this.setState({ route: null })
            return
        }
        else {
            let { driver_id, name, email, cell, address, route, dailyMessage } = this.state
            console.log(driver_id, name, email, cell, address, route, dailyMessage);

            let driver = {
                driver_id: driver_id, name: name, email: email, cell: cell, address: address,
                routeId: route.value, dailyMessage: dailyMessage
            }

            var options = {
                method: 'POST',
                body: JSON.stringify(driver),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewDriver', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            driver_id: '',
                            name: '',
                            email: '',
                            cell: '',
                            address: '',
                            route: '',
                            dailyMessage: ''
                        })
                    }
                    else {
                        this.driver_id.focus();
                    }
                    if (this._isMounted === true) {
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);

                    }
                })
                .catch((error) => console.log(error))
        }
    }

    render() {

        const { route, routes, showOptions } = this.state
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
        var routeOptions;
        if (showOptions) {

            routeOptions = routes.map(route => ({ key: route.id, label: route.name, value: route.id }));
        }


        return (
            // <Can I='create' a='driver'>
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol >
                        <MDBCard className=' py-5'>
                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                New Driver
                            </MDBCardHeader>
                            <MDBCardBody className='p-5'>

                                <form ref='newDriverForm' onSubmit={this.handleSubmit} noValidate>
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
                                                <MDBCol sm='1' className=''>
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
                                            <MDBBtn className='form-control py-0 font-weight-bold mt-4' size='lg' color="dark" outline type='submit'>Register</MDBBtn>
                                        </MDBCol>
                                    </MDBRow>
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


export default NewDriver
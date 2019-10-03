import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBAnimation, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard, MDBIcon } from 'mdbreact';
import Select from 'react-select';
import Notification from '../sections/Notification';
// import { Can } from '../../../configs/Ability-context'
import makeAnimated from 'react-select/animated';
import chroma from 'chroma-js';



class NewPerson extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this._isMounted = true
        fetch('/getAllRoles')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ roles: json.data })
                }
            })
            .catch((error) => console.log(error))
            .then(() => {
                if (props.new === 'Operator') {
                    let operator = this.state.roles.filter(role => role.name === 'operator').shift()
                    this.handleSelectChange('role')({ key: operator.id, label: operator.name, value: operator.id })
                }
                else
                    if (props.new === 'Driver') {
                        let driver = this.state.roles.filter(role => role.name === 'driver').shift()
                        this.handleSelectChange('role')({ key: driver.id, label: driver.name, value: driver.id })
                    }
            })
        if (props.new === 'Driver') {
            fetch('/getAllRoutes')
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted) {
                        this.setState({ routes: json.data })
                    }
                })
                .catch((error) => console.log(error))
        }

        this.state = {
            role: '',
            name: '',
            email: '',
            cell: '',
            address: '',
            username: '',
            password: '',
            location: '',
            dailyMessage: '',
            route: '',
            routes: [],
            roles: [],
            notificationMessage: '',
            notificationShow: false
        };

    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = name => selectedOption => {
        // console.log(name, selectedOption);
        if (name === 'role') {
            this.setState({
                role: selectedOption,
                location: '',
                dailyMessage: '',
            });
            this.roleSelected(selectedOption)
        }
        else {
            this.setState({
                route: selectedOption
            })
        }
    }

    roleSelected = (selectedOption) => {

        let persons = document.getElementsByClassName('person')
        let users = document.getElementsByClassName('user')
        let operators = document.getElementsByClassName('operator')
        let drivers = document.getElementsByClassName('driver')
        // console.log(users, operators, drivers,persons);


        for (let index = 0; index < persons.length; index++) {
            persons[index].classList.add('nodisplayed')
            persons[index].disabled = true
        }
        if (selectedOption === null) {
            this.submitBtn.classList.add('disabled')
            this.submitBtn.disabled = true
        }
        else {
            this.submitBtn.classList.remove('disabled')
            this.submitBtn.disabled = false
            switch (selectedOption.label.toLowerCase()) {
                case ('driver'):
                    for (let index = 0; index < drivers.length; index++) {
                        drivers[index].classList.remove('nodisplayed')
                        drivers[index].disabled = false
                    }
                    if (this.props.new !== 'User')
                        document.getElementById('newUserRoleSelect').classList.add('disabled')
                    break;
                case ('operator'):
                    for (let index = 0; index < operators.length; index++) {
                        operators[index].classList.remove('nodisplayed')
                        operators[index].disabled = false
                    }
                    if (this.props.new !== 'User')
                        document.getElementById('newUserRoleSelect').classList.add('disabled')
                    break;
                default:
                    for (let index = 0; index < users.length; index++) {
                        users[index].classList.remove('nodisplayed')
                        users[index].disabled = false
                    }
                    break;
            }
        }
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.newUserForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
            return
        }
        else if (this.props.new === 'Driver') {
            if (this.state.route.length === 0 || this.state.route === null || this.state.route === '') {
                this.setState({ route: null })
                return
            }
        }
        let { role, name, email, cell, address, username, password, location, dailyMessage, route } = this.state

        let user = {
            name: name, email: email, cell: cell, address: address, username: username, password: password,
            roleId: role.value, location: location, dailyMessage: dailyMessage
        }

        var options = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/addNewUser', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted === true) {
                    this.setState({ notificationMessage: json.message, notificationShow: true })
                }
                if (json.success === true) {
                    if (this.props.new === 'Driver') {
                        let driver = json.data
                        let driverId = driver.id
                        let Routes = []
                        route.forEach(Route => {
                            let routeId = Route.value
                            Routes.push({ route_id: routeId, driver_id: driverId })
                        })

                        let driverRoutes = { Routes: Routes }
                        var options = {
                            method: 'POST',
                            body: JSON.stringify(driverRoutes),
                            headers: { 'Content-Type': 'application/json' }
                        }
                        fetch('/addNewDriverRoutes', options)
                            .then((res) => res.json())
                            .then((json) => {
                                console.log(json)
                                if (this._isMounted) {
                                    this.setState({
                                        role: '',
                                        name: '',
                                        email: '',
                                        cell: '',
                                        address: '',
                                        username: '',
                                        password: '',
                                        location: '',
                                        dailyMessage: '',
                                        route: ''
                                    })
                                }
                            })
                            .catch((error) => console.log(error))
                    }
                }
                else {
                    this.username.focus();
                }

                if (this._isMounted === true) {
                    setTimeout(() => this.setState({ notificationShow: false }), 1802);
                }
            })
            .catch((error) => console.log(error))
        // }
    }

    render() {
        let { role, roles, name, email, cell, address, username, password, location, dailyMessage, route, routes } = this.state
        const roleStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : role !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none'
            })
        }
        let roleOptions;
        if (roles !== '' && roles.length !== 0 && roles !== null) {
            roleOptions = roles.map(role => ({ key: role.id, label: role.name, value: role.id }));
        }
        const animatedComponents = makeAnimated();
        const routeStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : route !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                fontSize: '16px',
                backgroundColor: 'white',
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                const color = chroma(data.color);
                return {
                    ...styles,
                    backgroundColor: isDisabled
                        ? null
                        : isSelected
                            ? data.color
                            : isFocused
                                ? color.alpha(0.1).css()
                                : null,
                    color: isDisabled
                        ? '#ccc'
                        : isSelected
                            ? chroma.contrast(color, 'white') > 2
                                ? 'white'
                                : 'black'
                            : data.color,
                    cursor: isDisabled ? 'not-allowed' : 'default',

                    ':active': {
                        ...styles[':active'],
                        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                    },
                };
            },
            multiValue: (styles, { data }) => {
                const color = chroma(data.color);
                return {
                    ...styles,
                    backgroundColor: color.alpha(0.1).css(),
                };
            },
            multiValueLabel: (styles, { data }) => ({
                ...styles,
                color: data.color,
            }),
            multiValueRemove: (styles, { data }) => ({
                ...styles,
                color: data.color,
                ':hover': {
                    backgroundColor: data.color,
                    color: 'white',
                },
            }),
        }
        let routeOptions
        routeOptions = routes.map(route => ({
            key: route.id,
            label: route.name,
            value: route.id,
            color: route.id % 2 === 0 ?
                '#3366cc' : '#006652'
        }));



        return (
            // <Can I='create' a='user'>
            <MDBContainer className='' fluid style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md='7'>
                        <MDBCard className=' py-2'>
                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className=" p-2 text-center font-weight-bold">
                                New {this.props.new}
                            </MDBCardHeader>
                            <MDBCardBody className='p-3'>

                                <form ref='newUserForm' onSubmit={this.handleSubmit} noValidate>
                                    <MDBRow around className="grey-text">
                                        <MDBCol md="5" >
                                            <MDBRow className='pt-4 mb-5' >
                                                <MDBCol sm='1' middle className=''>
                                                    <MDBIcon icon="user-tie" size='2x' />
                                                </MDBCol>
                                                <MDBCol className=''>
                                                    <Select
                                                        id='newUserRoleSelect'
                                                        styles={roleStyles}
                                                        value={role}
                                                        onChange={this.handleSelectChange('role')}
                                                        options={roleOptions}
                                                        placeholder='Role'
                                                        isSearchable
                                                        isClearable
                                                        className='form-control-md pl-0'
                                                        isOptionDisabled={option => option.label === 'super_admin'}
                                                    >
                                                    </Select>
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={name}
                                                label="Name"
                                                name='name'
                                                icon="user"
                                                inputRef={el => { this.name = el }}
                                                group
                                                type="text"
                                                required
                                                containerClass='nodisplayed person user operator driver'
                                                className='nodisplayed person user operator driver'
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={email}
                                                label="Email"
                                                name="email"
                                                icon="envelope"
                                                inputRef={el => { this.email = el }}
                                                group
                                                type="email"
                                                containerClass='nodisplayed person user operator'
                                                className='nodisplayed person user operator'
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={cell}
                                                label="Phone"
                                                name="cell"
                                                icon="phone"
                                                inputRef={el => { this.cell = el }}
                                                group
                                                type="text"
                                                containerClass='nodisplayed person user operator'
                                                className='nodisplayed person user operator'
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={address}
                                                label="Address"
                                                name="address"
                                                icon="map-marker-alt"
                                                inputRef={el => { this.address = el }}
                                                group
                                                type="text"
                                                containerClass='nodisplayed person user operator'
                                                className='nodisplayed person user operator'
                                                required
                                            />
                                            <MDBRow className='pt-4 mb-5'>
                                                <MDBCol className='m-0 pl-4 text-center'>
                                                    <label ref='label' className='nodisplayed person driver' style={{ fontFamily: 'monospace', color: '#6600cc' }}>{route ? route.length : 0} routes selected</label>
                                                    <Select
                                                        isMulti
                                                        styles={routeStyles}
                                                        value={route}
                                                        onChange={this.handleSelectChange('route')}
                                                        options={routeOptions}
                                                        placeholder='Select Routes..'
                                                        isSearchable
                                                        isClearable
                                                        className='form-control-md pl-4 pr-0 nodisplayed person driver'
                                                        components={animatedComponents}
                                                        closeMenuOnSelect={false}
                                                    />
                                                </MDBCol>
                                            </MDBRow>
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
                                        <MDBCol md="5" className='pt-0'>
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={username}
                                                label="Username"
                                                name="username"
                                                icon="user"
                                                inputRef={el => { this.username = el }}
                                                group
                                                type="text"
                                                containerClass='nodisplayed person user driver operator'
                                                className='nodisplayed person user driver operator'
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={password}
                                                label="Password"
                                                name="password"
                                                icon="lock"
                                                inputRef={el => { this.password = el }}
                                                group
                                                type="text"
                                                containerClass='nodisplayed person user operator driver'
                                                className='nodisplayed person user operator driver'
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={location}
                                                label="Location"
                                                name="location"
                                                icon="map-marker"
                                                inputRef={el => { this.location = el }}
                                                group
                                                type="text"
                                                containerClass='nodisplayed person operator'
                                                className='nodisplayed person operator'
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={dailyMessage}
                                                label="Daily Message"
                                                name="dailyMessage"
                                                icon="comment"
                                                inputRef={el => { this.dailyMessage = el }}
                                                group
                                                type="textarea"
                                                tag='div'
                                                containerClass='nodisplayed person driver'
                                                className='nodisplayed person driver'
                                                rows='2'
                                            />
                                            <div className='text-center mt-4'>
                                                <MDBBtn className=' py-2 font-weight-bold mt-0' disabled innerRef={el => this.submitBtn = el} size='lg' color="dark" outline type='submit'>Register</MDBBtn>
                                            </div>
                                        </MDBCol>
                                    </MDBRow>
                                </form>
                            </MDBCardBody>
                        </MDBCard>

                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            // </Can>
        );
    }
}


export default NewPerson
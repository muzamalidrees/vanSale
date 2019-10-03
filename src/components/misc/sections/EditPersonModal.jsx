import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBAnimation, MDBIcon, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBModalHeader, MDBInput } from 'mdbreact';
import Select from 'react-select';
import Notification from './Notification';
import makeAnimated from 'react-select/animated';
import chroma from 'chroma-js';



class EditPersonModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            userId: '',
            roleId: '',
            name: '',
            email: '',
            cell: '',
            address: '',
            username: '',
            password: '',
            location: '',
            dailyMessage: '',
            role: '',
            currentDriverRoutes: [],
            allDriverRoutes: [],
            allRoutes: [],
            roles: [],
            roleOptions: [],
            notificationMessage: '',
            notificationShow: false,
        }
    }

    fetchData = (id) => {

        this._isMounted = true
        let specificUserPath = '/getSpecificUser/' + id
        let paths = [specificUserPath, '/getAllRoles', '/getAllRoutes', '/getAllDriverRoutes']
        let dataRequests = paths.map(path => fetch(path))
        Promise.all(dataRequests)
            .then(responses => {
                Promise.all(responses.map(res => res.json()))
                    .then(jsons => {
                        let user = jsons[0].data, roles = jsons[1].data, allRoutes = jsons[2].data, allDriverRoutes = jsons[3].data
                        if (this._isMounted) {
                            this.setState({
                                user: user,
                                userId: user.id,
                                roleId: user.role_id,
                                name: user.name,
                                email: user.email,
                                cell: user.cell,
                                address: user.address,
                                username: user.username,
                                password: user.password,
                                location: user.location,
                                dailyMessage: user.daily_message,
                                roles: roles,
                                allRoutes: allRoutes,
                                allDriverRoutes: allDriverRoutes
                            })
                        }
                    })
                    .then(() => {
                        this.setCurrentDriverRoutes();
                    })
                    .then(() => {
                        this.toggle()
                        this.setRoleOptions()
                        this.props.disappearLoaderModal()
                    })
            })
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,
        });
    }

    setCurrentDriverRoutes = () => {
        let { userId, allRoutes, allDriverRoutes } = this.state
        let currentDriverRoutes = []
        allDriverRoutes.forEach(driverRoute => {
            if (driverRoute.driver_id === userId) {
                let route = allRoutes.find(route => route.id === driverRoute.route_id)
                if (route) {
                    let DriverRoute = {
                        key: route.id, label: route.name, value: route.id, color: route.id % 2 === 0 ?
                            '#3366cc' : '#006652'
                    }
                    currentDriverRoutes.push(DriverRoute)
                }
            }
        })
        this.setState({
            currentDriverRoutes: currentDriverRoutes
        })
    }


    setRoleOptions = () => {
        // console.log('being called');
        let { roles, roleId } = this.state
        let roleOptions = roles.map(role => ({ key: role.id, label: role.name, value: role.id }));
        let currentRole;
        roles.forEach(role => {
            if (role.id === roleId) {
                currentRole = { label: role.name, value: role.id }
            }
        });
        this.setState({
            roleOptions: roleOptions,
            //  role: currentRole,
        })
        this.handleSelectChange('role')(currentRole)
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = name => selectedOption => {
        // console.log(selectedOption);

        if (name === 'role') {
            this.setState({
                role: selectedOption,
            });
            this.roleSelected(selectedOption)
        }
        else {
            this.setState({
                currentDriverRoutes: selectedOption
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
                    break;
                case ('operator'):
                    for (let index = 0; index < operators.length; index++) {
                        operators[index].classList.remove('nodisplayed')
                        operators[index].disabled = false
                    }
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

    handleSubmit = (e) => {
        let { role, currentDriverRoutes } = this.state
        e.preventDefault();
        let form = this.refs.updateUserForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
            return
        }
        else if (role === '' || role === null) {
            this.setState({ role: null })
            return
        }
        else if (this.props.edit !== 'Operator') {
            if (currentDriverRoutes.length === 0 || currentDriverRoutes === null || currentDriverRoutes === '') {
                this.setState({ currentDriverRoutes: null })
                return
            }
        }

        let { userId, name, email, cell, address, username, password, location, dailyMessage } = this.state
        // console.log(userId, name, email, cell, address, username, password, location, dailyMessage, role);

        let user = {
            id: userId, name: name, email: email, cell: cell, address: address, username: username,
            password: password, location: location, dailyMessage: dailyMessage, roleId: role.value
        }

        var options = {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/updateUser', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted === true) {
                    this.setState({ notificationMessage: json.message, notificationShow: true })
                    setTimeout(() => {
                        this.setState({ notificationShow: false })
                    }, 1502);

                    if (role.label === 'driver') {
                        let driver = { driver_id: userId }
                        let deleteRouteOptions = {
                            method: 'DELETE',
                            body: JSON.stringify(driver),
                            headers: { 'Content-Type': 'application/json' }
                        }
                        fetch('/deleteDriverRoutes', deleteRouteOptions)
                            .then((res) => res.json())
                            .then((json) => {
                                // console.log(json)
                                let driverId = userId
                                let Routes = []
                                currentDriverRoutes.forEach(Route => {
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
                                        // console.log(json)
                                        setTimeout(() => {
                                            // closing edit modal
                                            this.toggle()
                                            // refreshing all records table
                                            // window.location.reload();
                                        }, 502);
                                    })
                                    .catch((error) => console.log(error))
                            })
                            .catch((error) => console.log(error))
                    }
                }
                else {
                    this.username.focus()
                }
            })
            .catch((error) => console.log(error))
    }





    render() {
        const { role, roleOptions, name, email, cell, address, username, password, location, dailyMessage, allRoutes, currentDriverRoutes } = this.state

        const customStyles = {
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
        const animatedComponents = makeAnimated();
        const routeStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : currentDriverRoutes !== null ?
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
        routeOptions = allRoutes.map(route => ({
            key: route.id,
            label: route.name,
            value: route.id,
            color: route.id % 2 === 0 ?
                '#3366cc' : '#006652'
        }));


        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='xl' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit {this.props.edit} Details</MDBModalHeader>
                    <MDBModalBody>

                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>

                                <form ref='updateUserForm' onSubmit={this.handleSubmit} noValidate>
                                    <MDBRow around className="grey-text">
                                        <MDBCol md="5" >
                                            {this.props.edit === 'User' ?
                                                <MDBRow className='pt-4 mb-5' >
                                                    <MDBCol sm='1' middle className='nodisplayed person user driver operator'>
                                                        <MDBIcon icon="user-tie" size='2x' />
                                                    </MDBCol>
                                                    <MDBCol className=''>
                                                        <Select
                                                            styles={customStyles}
                                                            value={role}
                                                            onChange={this.handleSelectChange('role')}
                                                            options={roleOptions}
                                                            placeholder='Role'
                                                            isSearchable
                                                            isClearable
                                                            className='form-control-md pl-0 nodisplayed person user driver operator'
                                                            isOptionDisabled={option => option.label === 'super_admin'}
                                                            ref={el => this.role = el}
                                                        >
                                                        </Select>
                                                    </MDBCol>
                                                </MDBRow>
                                                :
                                                null}
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={name}
                                                label="Name"
                                                name='name'
                                                icon="user"
                                                group
                                                type="text"
                                                containerClass='nodisplayed person user operator driver'
                                                className='nodisplayed person user operator driver'
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={email}
                                                label="Email"
                                                name="email"
                                                icon="envelope"
                                                group
                                                type="email"
                                                containerClass='nodisplayed person user operator'
                                                className='nodisplayed person user operator'
                                                required
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={cell||''}
                                                label="Phone"
                                                name="cell"
                                                icon="phone"
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
                                                group
                                                type="text"
                                                containerClass='nodisplayed person user operator'
                                                className='nodisplayed person user operator'
                                                required
                                            />
                                            <MDBRow className='pt-4 mb-5'>
                                                <MDBCol className='m-0 pl-4 text-center'>
                                                    <label ref='label' className='nodisplayed person driver' style={{ fontFamily: 'monospace', color: '#6600cc' }}>{currentDriverRoutes ? currentDriverRoutes.length : 0} routes selected</label>
                                                    <Select
                                                        isMulti
                                                        styles={routeStyles}
                                                        value={currentDriverRoutes}
                                                        onChange={this.handleSelectChange('route')}
                                                        options={routeOptions}
                                                        placeholder='Select Routes..'
                                                        isSearchable
                                                        isClearable
                                                        className='form-control-md pl-4 pr-0 nodisplayed person driver'
                                                        // components={animatedComponents}
                                                        closeMenuOnSelect={false}
                                                    />
                                                </MDBCol>
                                            </MDBRow>
                                        </MDBCol>
                                        <MDBCol md="5" className='pt-0'>
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={username}
                                                label="Username"
                                                inputRef={el => { this.username = el }}
                                                name="username"
                                                icon="user"
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
                                                group
                                                type="textarea"
                                                rows='1'
                                                containerClass='nodisplayed person driver'
                                                className='nodisplayed person driver'
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
                                    <div className='text-right'>
                                        <MDBBtn size='sm' className='px-2 font-weight-bold' color="secondary" onClick={this.toggle}>Close</MDBBtn>
                                        <MDBBtn size='sm' className='px-2 font-weight-bold' onClick={this.handleSubmit} innerRef={el => this.submitBtn = el} outline color="primary">Save updates</MDBBtn>
                                    </div>
                                </form>
                            </MDBCardBody>
                        </MDBCard>

                    </MDBModalBody>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default EditPersonModal;
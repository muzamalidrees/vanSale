import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon,MDBAnimation, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class SetDriverRoutes extends Component {
    _isMounted = false
    constructor() {
        super();
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
        fetch('/getAllRoutes')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ routes: json.data })
                }
            })
            .catch((error) => console.log(error))


        this.state = {
            users: [],
            roles: [],
            routes: [],
            driver: '',
            route: '',
            notificationMessage: '',
            notificationShow: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = name => selectedOption => {
        this.setState({
            [name]: selectedOption
        })
    }


    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.driver === '' || this.state.driver === null) {
            this.setState({ driver: null })
            return
        }
        else if (this.state.route === '' || this.state.route === null) {
            this.setState({ route: null })
            return
        }
        else {
            let driverId = this.state.driver.value
            let routeId = this.state.route.value


            console.log(driverId, routeId);
            let driverRoute = { driverId: driverId, routeId: routeId }

            var options = {
                method: 'POST',
                body: JSON.stringify(driverRoute),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewDriverRoute', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            driver: '',
                            route: '',
                        })
                    }
                    else {
                        this.route.focus();
                    }
                    if (this._isMounted === true) {
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);
                    }
                })
                .catch((error) => console.log(error))
        }
    }

    render() {

        const { driver, route, users, roles, routes } = this.state

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
                borderRadius: 'none',
            })
        }
        const routeStyles = {
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
        let roleId;
        let driverOptions;
        let routeOptions;

        if (roles !== '' && roles !== null && roles !== undefined) {
            roles.forEach(role => {
                if (role.name === 'driver') {
                    roleId = role.id
                }
            })
        }
        let drivers = users.filter(user => user.role_id === roleId)
        driverOptions = drivers.map(driver => ({ key: driver.id, label: driver.name, value: driver.id }));
        routeOptions = routes.map(route => ({ key: route.id, label: route.name, value: route.id }));



        return (
            <Can I='set' a='driverRoute'>
                <MDBContainer className='' style={{ marginTop: '80px' }}>
                    <MDBRow center>
                        <MDBCol md="6">
                            <MDBCard className=' p-5'>
                                <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="mb-5 text-center font-weight-bold">
                                    Set Drivers' Routes
                            </MDBCardHeader>
                                <MDBCardBody className='p-0'>

                                    <form onSubmit={this.handleSubmit} className='text-center'>
                                        <MDBRow className='mb-5 grey-text'>
                                            <MDBCol sm='1' className=''>
                                                <MDBIcon icon="user-alt" size='2x' />
                                            </MDBCol>
                                            <MDBCol>
                                                <Select
                                                    styles={driverStyles}
                                                    value={driver}
                                                    onChange={this.handleSelectChange('driver')}
                                                    options={driverOptions}
                                                    placeholder='Driver'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-lg px-0'
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow className='mb-5 grey-text'>
                                            <MDBCol sm='1' className=''>
                                                <MDBIcon icon="search-dollar" size='2x' />
                                            </MDBCol>
                                            <MDBCol>
                                                <Select
                                                    styles={routeStyles}
                                                    value={route}
                                                    onChange={this.handleSelectChange('route')}
                                                    options={routeOptions}
                                                    placeholder='Route'
                                                    isSearchable
                                                    isClearable
                                                    className='form-control-lg px-0'
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBBtn size='sm' className='mb-5' color="dark" outline type='submit'>Submit</MDBBtn>
                                    </form>
                                    <Can I='read' a='driverRoute'>
                                        <Link to='/driverRouting/all'>All Drivers' Routes..</Link>
                                    </Can>
                                </MDBCardBody>
                            </MDBCard>
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
                    </MDBRow>
                </MDBContainer>
            </Can>
        );
    }
}


export default SetDriverRoutes
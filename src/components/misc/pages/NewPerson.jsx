import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard, MDBIcon } from 'mdbreact';
import Select from 'react-select';
import Notification from '../sections/Notification';
import { Can } from '../../../configs/Ability-context'



class NewPerson extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllRoles')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ roles: json.data })
                }
            })
            .catch((error) => console.log(error))

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
            roles: [],
            notificationMessage: '',
            notificationShow: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelectChange = selectedOption => {
        this.setState({
            role: selectedOption
        })

        this.roleSelected(selectedOption);
    }

    roleSelected = (selectedOption) => {

        let allElements = [this.name, this.email, this.cell, this.address, this.username,
        this.password, this.location, this.dailyMessage]

        let driverElements = [this.name, this.email, this.cell, this.address, this.username,
        this.password, this.dailyMessage]

        let operatorElements = [this.name, this.email, this.cell, this.address, this.username,
        this.password, this.location]

        this.submitBtn.classList.remove('disabled')
        this.submitBtn.disabled = false
        if (selectedOption === null) {
            this.submitBtn.classList.add('disabled')
            this.submitBtn.disabled = true
            allElements.forEach(element => {
                element.disabled = true
            });
        }
        else {
            switch (selectedOption.label.toLowerCase()) {
                case ('driver'):
                    driverElements.forEach(element => {
                        element.disabled = false
                    });
                    break;
                case ('operator'):
                    operatorElements.forEach(element => {
                        element.disabled = false
                    });
                    break;
                default:
                    allElements.forEach(element => {
                        element.disabled = false
                    });
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
        }
        else {
            let { role, name, email, cell, address, username, password, location, dailyMessage } = this.state

            let user = {
                name: name, email: email, cell: cell, address: address, username: username, password: password,
                roleId: role.value, location: location, dailyMessage: dailyMessage
            }
            // console.log(user);

            var options = {
                method: 'POST',
                body: JSON.stringify(user),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewUser', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

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
                        })
                    }

                    if (this._isMounted === true) {
                        setTimeout(() => this.setState({ notificationShow: false }), 1802);
                    }
                })
                .catch((error) => console.log(error))
        }
    }

    render() {
        var { role, roles, name, email, cell, address, username, password, location, dailyMessage } = this.state

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


        var roleOptions;
        if (roles !== '' && roles !== [] && roles !== null) {

            roleOptions = roles.map(role => ({ key: role.id, label: role.name, value: role.id }));
        }



        return (
            // <Can I='create' a='user'>
            <MDBContainer className='' style={{ marginTop: '80px' }}>
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
                                                    {/* {showOptions ? */}
                                                    <Select
                                                        styles={roleStyles}
                                                        value={role}
                                                        onChange={this.handleSelectChange}
                                                        options={roleOptions}
                                                        placeholder='Role'
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
                                                value={name}
                                                label="Name"
                                                name='name'
                                                icon="user"
                                                inputRef={el => { this.name = el }}
                                                group
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                                disabled
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
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                                disabled
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
                                                validate
                                                error="wrong"
                                                success="right"
                                                disabled
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
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
                                                disabled
                                            />
                                            {
                                                this.state.notificationShow ?
                                                    <Notification
                                                        message={this.state.notificationMessage}
                                                    /> : null
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
                                                validate
                                                required
                                                disabled
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
                                                validate
                                                required
                                                disabled
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
                                                validate
                                                required
                                                disabled
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
                                                rows='2'
                                                validate
                                                disabled
                                            />
                                            <div className='text-center'>
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
import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard,MDBIcon } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class NewUser extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllRoles')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ roles: json.data, showOptions: true })
                }
            })
            .catch((error) => console.log(error))



        this.state = {
            role: '',
            name: '',
            email: '',
            cell: '',
            username: '',
            password: '',
            roles: '',
            showOptions: false,
            message: '',
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
        else if (this.state.role === '' || this.state.role === null) {
            this.setState({ role: null })
            return
        }
        else {
            let name = this.state.name
            let email = this.state.email
            let cell = this.state.cell
            let username = this.state.username
            let password = this.state.password
            let role = this.state.role.value

            console.log(name, email, cell, username, password, role);
            let user = { name: name, email: email, cell: cell, username: username, password: password, role: role }

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
                        this.setState({ message: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            role: '',
                            name: '',
                            email: '',
                            cell: '',
                            username: '',
                            password: ''
                        })
                    }
                    else {
                        this.username.focus();
                    }
                    if (this._isMounted === true) {
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);

                    }
                })
                .catch((error) => console.log(error))
        }
    }

    render() {

        const { role, roles, showOptions } = this.state
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
        var roleOptions;
        if (showOptions) {

            roleOptions = roles.map(role => ({ key: role.id, label: role.name, value: role.id }));
        }


        return (
            // <Can I='create' a='user'>
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="6">
                        <MDBCard className=' p-5'>

                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                New User
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>

                                <form ref='newUserForm' onSubmit={this.handleSubmit} noValidate>
                                    <div className="grey-text">
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
                                            required
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
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={this.state.username}
                                            label="Username"
                                            name="username"
                                            inputRef={el => { this.username = el }}
                                            icon="user"
                                            group
                                            type="text"
                                            validate
                                            required
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={this.state.password}
                                            label="Password"
                                            name="password"
                                            icon="lock"
                                            group
                                            type="text"
                                            validate
                                            required />
                                        <MDBRow className='mb-5'>
                                            <MDBCol sm='1' className=''>
                                                <MDBIcon icon="user-tie" size='2x' />
                                            </MDBCol>
                                            <MDBCol className=''>
                                                {/* {showOptions ? */}
                                                <Select
                                                    styles={customStyles}
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
                                    message={this.state.message}
                                /> : null
                        }
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            // </Can>
        );
    }
}


export default NewUser
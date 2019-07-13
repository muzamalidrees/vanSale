import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBCard, MDBCardBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';



class EditOrderModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            userId: '',
            role_id: '',
            role: '',
            name: '',
            email: '',
            cell: '',
            username: '',
            password: '',
            roles: '',
            roleOptions: [],
            message: '',
            notificationShow: false
        }
        // this.deleteProduct = this.deleteProduct.bind(this);
    }
    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificUser/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                var user = json.data
                if (this._isMounted === true) {
                    this.setState({
                        user: user,
                        userId: user.id,
                        role_id: user.role_id,
                        name: user.name,
                        email: user.email,
                        cell: user.cell,
                        username: user.username,
                        password: user.password,
                    })
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
                this.setRoleOptions(json.data);
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

    setRoleOptions = (roles) => {
        let roleOptions = roles.map(role => ({ key: role.id, label: role.name, value: role.id }));
        let currentRole;
        roles.forEach(role => {
            if (role.id.toString() === this.state.role_id) {
                currentRole = { label: role.name, value: role.id }
            }
        });
        this.setState({
            roleOptions: roleOptions, role: currentRole,
        })
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = selectedOption => {
        this.setState({
            role: selectedOption
        })

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.updateUserForm
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
            let userId = this.state.userId

            // console.log(userId, name, email, cell, username, password, role);
            let user = { id: userId, name: name, email: email, cell: cell, username: username, password: password, role: role }

            var options = {
                method: 'PUT',
                body: JSON.stringify(user),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/updateUser', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ message: json.message, notificationShow: true })
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
        const { role, roleOptions } = this.state
        const customStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : role !== null ?
                        '#ddd' : 'red',
                width: '191px',
            })
        }


        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit User Details</MDBModalHeader>
                    <MDBModalBody>

                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>

                                <form ref='updateUserForm' onSubmit={this.handleSubmit} noValidate>
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
                                            required>
                                            {/* <MDBIcon icon="home" style={{ float: 'left' }} /> */}
                                        </MDBInput>
                                        {/* {showOptions ? */}
                                        <div className=''>
                                            <Select
                                                styles={customStyles}
                                                // defaultValue={currentRole}
                                                value={this.state.role}
                                                onChange={this.handleSelectChange}
                                                options={roleOptions}
                                                placeholder='Role'
                                                isSearchable
                                                isClearable
                                            />
                                        </div>
                                        {/* : null */}
                                        {/* } */}
                                    </div>
                                    <div className='text-right'>

                                        <MDBBtn size='sm' className='px-2 font-weight-bold' color="secondary" onClick={this.toggle}>Close</MDBBtn>
                                        <MDBBtn size='sm' className='px-2 font-weight-bold' onClick={this.handleSubmit} outline color="primary">Save updates</MDBBtn>
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
                    <MDBModalFooter>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default EditOrderModal;
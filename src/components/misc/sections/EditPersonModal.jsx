import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBIcon, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBModalHeader, MDBInput } from 'mdbreact';
import Select from 'react-select';
import Notification from './Notification';



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
            roles: '',
            roleOptions: [],
            notificationMessage: '',
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
                        roleId: user.role_id,
                        name: user.name,
                        email: user.email,
                        cell: user.cell,
                        address: user.address,
                        username: user.username,
                        password: user.password,
                        location: user.location,
                        dailyMessage: user.dailyMessage,
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
            if (role.id === this.state.roleId) {
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
            let { userId, name, email, cell, address, username, password, location, dailyMessage, role } = this.state
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
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                        setTimeout(() => {
                            this.setState({ notificationShow: false })
                        }, 1502);
                    }
                    else {
                        this.email.focus()
                    }
                })
                .catch((error) => console.log(error))

            setTimeout(() => {
                //closing edit modal
                this.toggle()
                // refreshing all records table
                window.location.reload();
            }, 2002);

        }
    }





    render() {
        const { role, roleOptions, name, email, cell, address, username, password, location, dailyMessage } = this.state
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


        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit {this.props.edit} Details</MDBModalHeader>
                    <MDBModalBody>

                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>

                                <form ref='updateUserForm' onSubmit={this.handleSubmit} noValidate>
                                    <MDBRow around className="grey-text">
                                        <MDBCol md="5" >
                                            {this.props.edit === 'User' ?

                                                <MDBRow className='pt-4 mb-5' >
                                                    <MDBCol sm='1' middle className=''>
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
                                                            ref={el => this.role = el}
                                                        >
                                                        </Select>
                                                        {/* : null */}
                                                        {/* } */}
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
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
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
                                            />
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={cell}
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
                                                value={address}
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
                                        </MDBCol>
                                        <MDBCol md="5" className='pt-0'>
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={username}
                                                label="Username"
                                                name="username"
                                                icon="user"
                                                group
                                                type="text"
                                                validate
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
                                                validate
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
                                                validate
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
                                                validate
                                            />
                                        </MDBCol>
                                    </MDBRow>
                                    {
                                        this.state.notificationShow ?
                                            <Notification
                                                message={this.state.notificationMessage}
                                            />
                                            : null
                                    }
                                    <div className='text-right'>
                                        <MDBBtn size='sm' className='px-2 font-weight-bold' color="secondary" onClick={this.toggle}>Close</MDBBtn>
                                        <MDBBtn size='sm' className='px-2 font-weight-bold' onClick={this.handleSubmit} outline color="primary">Save updates</MDBBtn>
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
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
import Select from 'react-select';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class SetRolesPermissions extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllPermissions')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ permissions: json.data })
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
        this.state = {
            permissions: [],
            roles: [],
            role: '',
            permission: '',
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
        if (this.state.role === '' || this.state.role === null) {
            this.setState({ role: null })
            return
        }
        else if (this.state.permission === '' || this.state.permission === null) {
            this.setState({ permission: null })
            return
        }
        else {
            let roleId = this.state.role.value
            let permissionId = this.state.permission.value

            let rolePermission = { roleId: roleId, permissionId: permissionId }

            var options = {
                method: 'POST',
                body: JSON.stringify(rolePermission),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewRolePermission', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            role: '',
                            permission: '',
                        })
                    }
                    else {
                        this.permission.focus();
                    }
                    if (this._isMounted === true) {
                        setTimeout(() => {
                            this.setState({ notificationShow: false })
                            window.location.reload()
                        }, 1702);
                    }
                })
                .catch((error) => console.log(error))
        }
    }

    render() {

        const { role, roles, permission, permissions } = this.state

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
                borderRadius: 'none',
            })
        }
        const permissionStyles = {
            control: (base, state) => ({
                ...base,
                borderBottomColor: state.isFocused ?
                    '#ddd' : permission !== null ?
                        '#ddd' : 'red',
                fontWeight: 370,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            })
        }
        let roleOptions, permissionOptions

        roleOptions = roles.map(role => ({ key: role.id, label: role.name, value: role.id }));
        permissionOptions = permissions.map(permission => ({ key: permission.id, label: permission.slug, value: permission.id }));



        return (
            // <Can I='create' a='rolePermission'>
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="6">
                        <MDBCard className=' p-5'>

                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="mb-5 text-center font-weight-bold">
                                Set Roles' Permissions
                            </MDBCardHeader>
                            <MDBCardBody className='p-0'>

                                <form onSubmit={this.handleSubmit} className='text-center'>
                                    <MDBRow className='mb-5 grey-text'>
                                        <MDBCol sm='1' className=''>
                                            <MDBIcon icon="user-alt" size='2x' />
                                        </MDBCol>
                                        <MDBCol>
                                            <Select
                                                styles={roleStyles}
                                                value={role}
                                                onChange={this.handleSelectChange('role')}
                                                options={roleOptions}
                                                placeholder='Role'
                                                isSearchable
                                                isClearable
                                                className='form-control-lg px-0'
                                            />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className='mb-5 grey-text'>
                                        <MDBCol sm='1' className=''>
                                            <MDBIcon icon="ribbon" size='2x' />
                                        </MDBCol>
                                        <MDBCol>
                                            <Select
                                                styles={permissionStyles}
                                                value={permission}
                                                onChange={this.handleSelectChange('permission')}
                                                options={permissionOptions}
                                                placeholder='Permission'
                                                isSearchable
                                                isClearable
                                                className='form-control-lg px-0'
                                            />
                                        </MDBCol>
                                    </MDBRow>

                                    <MDBBtn size='sm' className='mb-5' color="dark" outline type='submit'>Submit</MDBBtn>
                                </form>
                                <Link to='/rolePermissioning/all'>All Roles' Permissions..</Link>
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


export default SetRolesPermissions
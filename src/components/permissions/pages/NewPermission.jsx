import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class NewPermission extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        this.state = {
            permission: '',
            entity: '',
            slug: '',
            notificationMessage: '',
            notificationShow: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleInput = e => {
        let str = e.target.value
        this.setState({
            [e.target.name]: str.toLowerCase()
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.newPermissionForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else {
            let { permission, entity, slug } = this.state
            let newPermission = { permission: permission, entity: entity, slug: slug }

            var options = {
                method: 'POST',
                body: JSON.stringify(newPermission),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewPermission', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            permission: '',
                            entity: '',
                            slug: ''
                        })
                    }
                    else {
                        this.name.focus();
                    }
                    if (this._isMounted === true) {
                        setTimeout(() => this.setState({ notificationShow: false }), 1502);
                    }
                })
                .catch((error) => console.log(error))
        }
    }

    render() {

        var { permission, entity, slug } = this.state

        return (
            // <Can I='create' a='permission'>
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="6">
                        <MDBCard className=' p-5'>
                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                New Permission
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>

                                <form ref='newPermissionForm' onSubmit={this.handleSubmit} noValidate>
                                    <div className="grey-text">
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={permission}
                                            label="Permission"
                                            name='permission'
                                            icon="pen-nib"
                                            inputRef={el => { this.permission = el }}
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            required
                                            hint='e.g. edit'
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={entity}
                                            label="Entity"
                                            name='entity'
                                            icon="boxes"
                                            inputRef={el => { this.entity = el }}
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            required
                                            hint='e.g. user'
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={slug}
                                            label="Slug"
                                            name='slug'
                                            icon="pen-nib"
                                            inputRef={el => { this.slug = el }}
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            required
                                            hint='e.g. edit_user'
                                        />
                                    </div>
                                    <div className="text-right">
                                        <MDBBtn size='sm' color="teal" outline type='submit'>Register</MDBBtn>
                                    </div>
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


export default NewPermission
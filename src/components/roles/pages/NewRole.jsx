import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class NewUser extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        this.state = {
            name: '',
            message: '',
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
        let form = this.refs.newRoleForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else {
            let name = this.state.name
            let role = { name: name }

            var options = {
                method: 'POST',
                body: JSON.stringify(role),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewRole', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ message: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            name: ''
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

        var { name } = this.state

        return (
            <Can I='create' a='role'>
                <MDBContainer className='' style={{ marginTop: '80px' }}>
                    <MDBRow center>
                        <MDBCol md="6">
                            <MDBCard className=' p-5'>
                                <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                    New Role
                                </MDBCardHeader>
                                <MDBCardBody className='p-2'>

                                    <form ref='newRoleForm' onSubmit={this.handleSubmit} noValidate>
                                        <div className="grey-text">
                                            <MDBInput
                                                onInput={this.handleInput}
                                                value={this.state.name}
                                                label="Name"
                                                name='name'
                                                icon="pen-nib"
                                                inputRef={el => { this.name = el }}
                                                group
                                                type="text"
                                                validate
                                                error="wrong"
                                                success="right"
                                                required
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
                                        message={this.state.message}
                                    /> : null
                            }
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </Can>
        );
    }
}


export default NewUser
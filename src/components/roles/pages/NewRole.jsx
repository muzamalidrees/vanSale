import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn,MDBAnimation, MDBInput, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class NewUser extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        this.state = {
            name: '',
            notificationMessage: '',
            notificationShow: false
        };
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
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

        let { name } = this.state

        return (
            <Can I='create' a='role'>
                <MDBContainer className='' style={{ marginTop: '80px' }}>
                    <MDBRow center>
                        <MDBCol md="6">
                            <MDBCard className=' p-5'>
                                <MDBCardHeader tag="h4" style={{ color: 'teal' }} className="text-center font-weight-bold">
                                    New Role
                                </MDBCardHeader>
                                <MDBCardBody className='p-2'>

                                    <form ref='newRoleForm' onSubmit={this.handleSubmit} noValidate>
                                        <div className="grey-text">
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
                                            />
                                        </div>
                                        <div className="text-center">
                                            <MDBBtn size='sm' color="teal" outline type='submit'>Create</MDBBtn>
                                        </div>
                                    </form>
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


export default NewUser
import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBCard, MDBCardBody, MDBModalHeader, MDBInput } from 'mdbreact';
import Notification from '../../../misc/sections/Notification';



class EditRouteModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            routeId: '',
            name: '',
            description: '',
            notificationMessage: '',
            notificationShow: false
        }
    }
    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificRoute/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                let route = json.data
                if (this._isMounted === true) {
                    this.setState({
                        routeId: route.id,
                        name: route.name,
                        description: route.description,
                    })
                }
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

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.updateRouteForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else {
            let { routeId, name, description } = this.state
            console.log(routeId, name, description);

            let route = { id: routeId, name: name, description: description }

            var options = {
                method: 'PUT',
                body: JSON.stringify(route),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/updateRoute', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
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

        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='md' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit Route Details</MDBModalHeader>
                    <MDBModalBody>

                        <MDBCard className=' p-5'>
                            <MDBCardBody className='p-2'>

                                <form ref='updateRouteForm' onSubmit={this.handleSubmit} noValidate>
                                    <div className="grey-text">
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={this.state.name}
                                            label="Name"
                                            name='name'
                                            icon="pen-nib"
                                            group
                                            type="text"
                                            validate
                                            error="wrong"
                                            success="right"
                                            required
                                            inputRef={el => { this.name = el }}
                                        />
                                        <MDBInput
                                            onInput={this.handleInput}
                                            value={this.state.description}
                                            label="Description"
                                            name="description"
                                            icon="file-alt"
                                            group
                                            type="textarea"
                                            rows='2'
                                            validate
                                            error="wrong"
                                            success="right"
                                        />
                                    </div>
                                    <div className='text-center'>
                                        <MDBBtn size='sm' className=' font-weight-bold' color="dark" onClick={this.toggle}>Close</MDBBtn>
                                        <MDBBtn size='sm' className=' font-weight-bold' onClick={this.handleSubmit} outline color="dark">Save updates</MDBBtn>
                                    </div>
                                </form>
                            </MDBCardBody>
                            {
                                this.state.notificationShow ?
                                    <Notification
                                        message={this.state.notificationMessage}
                                    />
                                    : null
                            }
                        </MDBCard>


                    </MDBModalBody>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default EditRouteModal;
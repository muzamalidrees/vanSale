import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBCardBody, MDBCardHeader, MDBCard } from 'mdbreact';
import Notification from '../../misc/sections/Notification';
import { Can } from '../../../configs/Ability-context'



class NewProductCategory extends Component {
    _isMounted = false
    constructor() {
        super();
        this.state = {
            name: '',
            description: '',
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
        let form = this.refs.newProductCategoryForm
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else {
            let { name, description } = this.state
            // console.log(name, description);

            let productCategory = { name: name, description: description }

            var options = {
                method: 'POST',
                body: JSON.stringify(productCategory),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/addNewProductCategory', options)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({ notificationMessage: json.message, notificationShow: true })
                    }
                    if (json.success === true) {

                        this.setState({
                            name: '',
                            description: '',
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

        return (
            <Can I='create' a='productCategory'>
                <MDBContainer className='' style={{ marginTop: '80px' }}>
                    <MDBRow center>
                        <MDBCol md="6">
                            <MDBCard className=' p-5'>

                                <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                    New Product Category
                            </MDBCardHeader>
                                <MDBCardBody className='p-2'>

                                    <form ref='newProductCategoryForm' onSubmit={this.handleSubmit} noValidate>
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
                                        <div className="text-center">
                                            <MDBBtn size='sm' color="dark" outline type='submit'>Submit</MDBBtn>
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
            </Can >
        );
    }
}


export default NewProductCategory
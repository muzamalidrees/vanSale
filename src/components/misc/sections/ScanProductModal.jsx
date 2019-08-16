import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBInput, MDBModalHeader } from 'mdbreact';



class ScanProductModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            barcode: ''
        }
    }


    componentWillUnmount = () => {
        this._isMounted = false
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,

        });
    }

    handleInput = (e) => {
        this.setState({
            barcode: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.scanProductForm;
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else {
            this.props.selectProduct(this.state.barcode)
            this.setState({
                barcode: ''
            })
            this.toggle()
        }
    }

    scanProduct = () => {
        let barcode
        this.setState({ barcode: barcode })
    }

    render() {

        let { barcode } = this.state

        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} autoFocus={true} position="top-left" animation="bottom" >
                    <MDBModalHeader toggle={this.toggle}>
                        Scan Product or add Barcode manually.
                    </MDBModalHeader>
                    <MDBModalBody>
                        <form ref='scanProductForm' onSubmit={this.handleSubmit} noValidate>
                            <MDBInput type='text' value={barcode} onInput={this.handleInput} label='Barcode' required validate outline />
                            <div className='text-right'>
                                <MDBBtn className="px-4 btn btn-mdb-color font-weight-bold" onClick={this.scanProduct}>Scan</MDBBtn>
                                <MDBBtn type='submit' className="px-4 btn btn-elegant font-weight-bold">Add</MDBBtn>
                            </div>
                        </form>
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default ScanProductModal;
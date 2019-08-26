import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBInput, MDBModalHeader } from 'mdbreact';



class ScanProductModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
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

    handleSubmit = (e) => {
        e.preventDefault();
        let form = this.refs.scanProductForm;
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else {
            this.props.selectProduct(document.getElementById('barcodeInput').value)
            this.setState({
                barcode: ''
            })
            this.toggle()
        }
    }

    scanProduct = () => {
        // window.Android.showToast("webAppinterface working normally.")
        if (window.Android !== undefined) {
            window.Android.scanProduct();
        }
        else {
            this.message.innerHTML = 'Please make sure you are running from an android device.'
            this.message.style.display = ''
        }
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
                            <MDBInput id='barcodeInput' type='text' value={barcode} onInput={this.handleInput} hint='Barcode' required validate outline />
                            <label style={{ fontFamily: 'monospace', display: 'none', color: 'red' }} className='mt-0 p-0' ref={el => this.message = el}></label>
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
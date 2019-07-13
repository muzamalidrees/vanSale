import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon } from
    'mdbreact';

class DeleteModal extends Component {
    state = {
        modalShow: false,
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,

        });
    }

    deleteEntry = () => {
        this.props.deleteEntry();
        this.toggle();
    }

    render() {
        return (
            <MDBContainer>
                <MDBModal modalStyle="danger" className="text-white" size="sm" centered backdrop={false} isOpen={this.state.modalShow}
                    toggle={this.toggle}>
                    <MDBModalHeader className="text-center" titleClass="w-100" tag="p" toggle={this.toggle}>
                        Are you sure?
                    </MDBModalHeader>
                    <MDBModalBody className="text-center">
                        <MDBIcon icon="times" size="4x" className="animated rotateIn" />
                    </MDBModalBody>
                    <MDBModalFooter className="justify-content-center">
                        <MDBBtn color="danger" onClick={this.deleteEntry}>Yes</MDBBtn>
                        <MDBBtn color="danger" outline onClick={this.toggle}>No</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}

export default DeleteModal;
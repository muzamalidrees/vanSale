import React from 'react';
import { MDBModal, MDBModalBody } from 'mdbreact'

class LoaderModal extends React.Component {
    state = {
        modalShow: false,
    }
    render() {

        return (
            <MDBModal size="sm" centered backdrop={true}
                // isOpen={this.state.modalShow}
                isOpen={this.props.show}
                toggle={() => { }}>
                <MDBModalBody className="text-center">
                    <div className="spinner-border text-dark" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </MDBModalBody>
            </MDBModal>
        )
    }
}


export default LoaderModal
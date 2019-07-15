import React, { Component } from "react";
import { MDBNotification } from "mdbreact";

class Notification extends Component {
    
    render() {
        return (

            <MDBNotification
                show
                fade
                labelColor="#2BBBAD"
                title="Van Sales"
                closeClassName="blue-grey-text"
                message={this.props.message}
                autohide={1500}
                style={{
                    // position: "absolute",
                    // left: 50,
                    // right: 50,
                    // float:'right'
                }}
                bodyClassName="p-2 font-weight-bold"
            />
        );
    }
}

export default Notification;
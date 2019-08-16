import React, { Component } from "react";
import { MDBNotification } from "mdbreact";

class Notification extends Component {

    render() {
        return (

            <MDBNotification
                show
                fade
                labelcolor="#2BBBAD"
                title="New Message"
                closeClassName="blue-grey-text"
                message={this.props.message}
                icon={`${this.props.icon}`}
                iconClassName="text-info"
                bodyClassName="p-2 font-weight-bold"
                text="just now"
            />
        );
    }
}

export default Notification;
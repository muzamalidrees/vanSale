import React from 'react';
import { MDBFooter } from 'mdbreact';

class Footer extends React.Component {
    render() {

        return (
            <MDBFooter color="black" className="text-center fixed-bottom font-small mt-5" >
                <p className="footer-copyright mb-0 py-3 text-center">
                    &copy; {new Date().getFullYear()} Copyright: <a href="http://devzone.com.pk/"> DevZone </a>
                </p>
            </MDBFooter>
        )
    }
}


export default Footer
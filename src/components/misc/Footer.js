import React from 'react';
import { MDBFooter } from 'mdbreact';

class Footer extends React.Component {
    render() {

        return (
            <div style={{ marginTop: '110px' }}>
                <MDBFooter color="black" className="text-center fixed-bottom mb-0 font-small" >
                    <p className="footer-copyright mb-0 py-3 text-center">
                        &copy; {new Date().getFullYear()} Copyright: <a href="http://devzone.com.pk/"> DevZone </a>
                    </p>
                </MDBFooter>
            </div>
        )
    }
}


export default Footer
import React from 'react';
import { MDBRow, MDBCol } from 'mdbreact';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {

        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    render() {

        if (this.state.errorInfo) {

            //if error render this
            return (
                <>
                    <MDBRow style={{ marginTop: '72px' }}>
                        <MDBCol md='12' className='text-center float-md-none mx-auto'>
                            <img
                                src="/404_mdb.png"
                                alt="Error 404"
                                className="img-fluid wow fadeIn animated"
                                style={{ visibility: 'visible', animationName: 'fadeIn', animationIterationCount: 1 }} />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="mt-5">
                        <MDBCol md='12' className="text-center mb-5">
                            <h2 className="h2-responsive wow fadeIn mb-4 animated" data-wow-delay="0.2s" style={{ fontWeight: 500, visibility: 'visible', animationName: 'fadeIn', animationIterationCount: 1, animationDelay: '0.2s' }}>Oops! Something went wrong.</h2>
                        </MDBCol>
                    </MDBRow >
                </>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}


export default ErrorBoundary
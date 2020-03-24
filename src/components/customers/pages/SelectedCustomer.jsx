import React, { Component } from 'react';
import { MDBCol, MDBBtn, MDBNavLink, MDBFooter } from 'mdbreact';


class SelectedCustomer extends Component {


    render() {
        let params = new URLSearchParams(window.location.search)
        // console.log(this.props)
        // console.log(params.get("@"));
        let style = { width: '100%' }, customer = params.get('@')

        return (
            <MDBCol className='top p-0 mx-0 mb-0'>
                <MDBBtn size='lg' outline color='primary' style={style} className='font-weight-bold p-0'>
                    <MDBNavLink to={{ pathname: "/invoices/customer", search: `@=${customer}` }}>
                        View Previous Invoices
                    </MDBNavLink>
                </MDBBtn>
                <MDBBtn size='lg' outline color='primary' style={style} className='font-weight-bold p-0'>
                    <MDBNavLink to={{ pathname: "/sales/new", search: `@=${customer}` }}>
                        Create New Sale
                    </MDBNavLink>
                </MDBBtn>
                <MDBBtn size='lg' outline color='primary' style={style} className='font-weight-bold p-0'>
                    <MDBNavLink to={{ pathname: "/returns/new", search: `@=${customer}` }}>
                        Create New Return
                    </MDBNavLink>
                </MDBBtn>
                <MDBFooter className='text-center fixed-bottom mb-5 font-small'>
                    <MDBBtn size='sm' color='primary' className='mb-2 w-50' onClick={() => window.history.go(-1)}>Back</MDBBtn>
                </MDBFooter>
            </MDBCol>
        )
    }
}
export default SelectedCustomer
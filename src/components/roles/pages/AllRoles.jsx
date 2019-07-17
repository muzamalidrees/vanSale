import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon, MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllRoles extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllRoles')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ roles: json.data })
                }
            })
            .catch((error) => console.log(error))
        this.state = {
            rowToBeDeleted: '',
            dRowValue: '',
            roles: [],
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    handleDelete = (id) => (e) => {
        let el = e.target
        let row = el.closest('tr')
        var i = row.rowIndex;
        this.setState({
            rowToBeDeleted: i,
            dRowValue: id
        })
        this.refs.deleteModal.setState({
            modalShow: true,
        })
    }

    deleteRole = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('rolesTable').deleteRow(rowToBeDeleted)
        let role = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(role),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteRole', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { roles } = this.state;
        var rows = [];
        var index = 0;

        roles.forEach((role) => {

            index = index + 1;
            rows.push(
                {
                    index: index,
                    name: role.name,
                    buttons: <React.Fragment>
                        <Can I='delete' a='role'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(role.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Name', field: 'name' },
                { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="6">
                        <MDBCard className=' p-0'>
                            <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                                User' Roles
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>

                                <MDBDataTable id='rolesTable' striped small hover theadColor="dark"
                                    bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                                    data={data} theadTextWhite >
                                </MDBDataTable>
                                <DeleteModal
                                    ref='deleteModal'
                                    deleteEntry={this.deleteRole}
                                />
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }

}

export default AllRoles
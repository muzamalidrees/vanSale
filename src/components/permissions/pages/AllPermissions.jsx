import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon, MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllPermissions extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllPermissions')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ permissions: json.data })
                }
            })
            .catch((error) => console.log(error))
        this.state = {
            rowToBeDeleted: '',
            dRowValue: '',
            permissions: [],
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

    deletePermission = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('permissionsTable').deleteRow(rowToBeDeleted)
        let permission = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(permission),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deletePermission', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { permissions } = this.state;
        var rows = [];
        var index = 0;

        permissions.forEach((permission) => {

            index = index + 1;
            rows.push(
                {
                    index: index,
                    permission: permission.permission,
                    entity: permission.entity,
                    slug: permission.slug,
                    buttons: <React.Fragment>
                        <Can I='delete' a='permission'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(permission.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', },
                { label: 'Permission', field: 'permission' },
                { label: 'Entity', field: 'entity' },
                { label: 'Slug', field: 'slug' },
                { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (
            <MDBContainer className='' style={{ marginTop: '80px' }}>
                <MDBRow center>
                    <MDBCol md="8">
                        <MDBCard className=' p-0'>
                            <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                                Roles' Permissions
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>

                                <MDBDataTable id='permissionsTable' striped small hover theadColor="dark"
                                    bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                                    data={data} theadTextWhite >
                                </MDBDataTable>
                                <DeleteModal
                                    ref='deleteModal'
                                    deleteEntry={this.deletePermission}
                                />
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }

}

export default AllPermissions
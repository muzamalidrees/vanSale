import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import EditProductCategoryModal from './sections/EditProductCategoryModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllProductCategories extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllProductCategories')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ productCategories: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            productCategories: [],
            rowToBeDeleted: '',
            dRowValue: '',
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }


    handleEdit = (id) => (e) => {
        this.refs.editProductCategoryModal.setState({
            modalShow: true
        })
        this.refs.editProductCategoryModal.fetchData(id);
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

    deleteProductCategory = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('productCategoriesTable').deleteRow(rowToBeDeleted)
        let productCategory = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(productCategory),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteProductCategory', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { productCategories } = this.state;
        var rows = [];
        var index = 0;

        productCategories.forEach((productCategory) => {

            index = index + 1;
            rows.push(
                {
                    index: index,
                    name: productCategory.name,
                    description: productCategory.description,
                    buttons: <React.Fragment>
                        <Can I='update' a='productCategory'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(productCategory.id)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can>
                        <Can I='delete' a='productCategory'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(productCategory.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Name', field: 'name' },
                { label: 'Description', field: 'description', }, { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (
            <Can I='read' a='productCategory'>
                <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                    <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                        Product Categories
                </MDBCardHeader>
                    <MDBCardBody className='p-2'>

                        <MDBDataTable id='productCategoriesTable' striped small hover theadColor="dark"
                            bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                            data={data} theadTextWhite >
                        </MDBDataTable>
                        <EditProductCategoryModal
                            ref='editProductCategoryModal'
                        />
                        <DeleteModal
                            ref='deleteModal'
                            deleteEntry={this.deleteProductCategory}
                        />
                    </MDBCardBody>
                </MDBCard>
            </Can>
        );
    }

}

export default AllProductCategories
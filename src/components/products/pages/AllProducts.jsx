import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import EditProductModal from './sections/EditProductModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllProducts extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data })
                }
            })
            .catch((error) => console.log(error))
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
            products: [],
            rowToBeDeleted: '',
            dRowValue: '',
            productCategories: [],
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }


    handleEdit = (id) => (e) => {
        this.refs.editProductModal.setState({
            modalShow: true
        })
        this.refs.editProductModal.fetchData(id);
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

    deleteProduct = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('productsTable').deleteRow(rowToBeDeleted)
        let product = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(product),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteProduct', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { products, productCategories } = this.state;
        var rows = [];
        var index = 0;

        products.forEach((product) => {

            index = index + 1;
            let currentProductCategory;
            if (productCategories !== '' && productCategories !== null && productCategories !== undefined) {
                productCategories.forEach(productCategory => {
                    if (productCategory.id === product.product_category_id) {
                        currentProductCategory = productCategory.name
                    }
                });
            }
            rows.push(
                {
                    index: index,
                    name: product.name,
                    description: product.description,
                    barcode: product.barcode,
                    productCategory: currentProductCategory,
                    buttons: <React.Fragment>
                        <Can I='update' a='product'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(product.id)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can>
                        <Can I='delete' a='product'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(product.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Name', field: 'name' },
                { label: 'Description', field: 'description', }, { label: 'Barcode', field: 'barcode', },
                { label: 'Product-Category', field: 'productCategory', },
                { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (

            <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                    Products
                </MDBCardHeader>
                <MDBCardBody className='p-2'>

                    <MDBDataTable id='productsTable' striped small hover theadColor="dark"
                        bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                        data={data} theadTextWhite >
                    </MDBDataTable>
                    <EditProductModal
                        ref='editProductModal'
                    />
                    <DeleteModal
                        ref='deleteModal'
                        deleteEntry={this.deleteProduct}
                    />
                </MDBCardBody>
            </MDBCard>
        );
    }

}

export default AllProducts
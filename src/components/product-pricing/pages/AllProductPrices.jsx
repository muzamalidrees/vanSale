import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import DeleteModal from '../../misc/sections/DeleteModal';
import EditProductPriceModal from './sections/EditProductPriceModal'
import { Can } from "../../../configs/Ability-context";


class AllProductPrices extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllProductPrices')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ productPrices: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllPriceGroups')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                if (this._isMounted) {
                    this.setState({ priceGroups: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            productPrices: [],
            products: [],
            priceGroups: [],
            rowToBeDeleted: '',
            dRowValue: '',
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

    handleEdit = (id) => (e) => {
        this.refs.editProductPriceModal.setState({
            modalShow: true
        })
        this.refs.editProductPriceModal.fetchData(id);
    }

    deleteProductPrice = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('productPricesTable').deleteRow(rowToBeDeleted)
        let productPrice = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(productPrice),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteProductPrice', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { products, priceGroups, productPrices } = this.state;
        var rows = [];
        var index = 0;

        productPrices.forEach((productPrice) => {

            index = index + 1;
            let currentProduct;
            let currentPriceGroup;
            if (products !== '' && products !== null && products !== undefined) {
                products.forEach(product => {
                    if (product.id.toString() === productPrice.product_id) {
                        currentProduct = product.name
                    }
                });
            }
            if (priceGroups !== '' && priceGroups !== null && priceGroups !== undefined) {
                priceGroups.forEach(priceGroup => {
                    if (priceGroup.id.toString() === productPrice.price_group_id) {
                        currentPriceGroup = priceGroup.name
                    }
                });
            }
            rows.push(
                {
                    index: index,
                    priceGroup: currentPriceGroup,
                    product: currentProduct,
                    sellPrice: productPrice.sell_price,
                    buyBackprice: productPrice.buy_back_price,
                    buttons: <React.Fragment>
                        <Can I='edit' a='productPrice'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(productPrice.id)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can>
                        <Can I='delete' a='productPrice'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(productPrice.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Price-Group', field: 'priceGroup', },
                { label: 'Product', field: 'product' }, { label: 'Selling-Price', field: 'sellPrice' },
                { label: 'Buying-back-Price', field: 'buyBackprice' }, { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (

            <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                    Products' Prices
                </MDBCardHeader>
                <MDBCardBody className='p-2'>

                    <MDBDataTable id='productPricesTable' striped small hover theadColor="dark"
                        bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                        data={data} theadTextWhite >
                    </MDBDataTable>
                    <EditProductPriceModal
                        ref='editProductPriceModal'
                    />
                    <DeleteModal
                        ref='deleteModal'
                        deleteEntry={this.deleteProductPrice}
                    />
                </MDBCardBody>
            </MDBCard>
        );
    }

}

export default AllProductPrices
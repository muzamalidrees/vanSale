import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import EditPriceGroupModal from './sections/EditPriceGroupModal';
import ViewPriceGroupModal from './sections/ViewPriceGroupModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllPriceGroups extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllPriceGroups')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ priceGroups: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllProductCategories')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ productCategories: json.data })
                }
            })
            .catch((error) => console.log(error))
        this.state = {
            priceGroups: [],
            rowToBeDeleted: '',
            dRowValue: '',
            productCategories: []
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    handleView = (id) => (e) => {

        this.refs.viewPriceGroupModal.fetchData(id);
        this.refs.viewPriceGroupModal.setState({
            modalShow: true
        })
    }

    handleEdit = (id) => (e) => {
        this.refs.editPriceGroupModal.setState({
            modalShow: true
        })
        this.refs.editPriceGroupModal.fetchData(id);
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

    deletePriceGroup = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('priceGroupsTable').deleteRow(rowToBeDeleted)
        let priceGroup = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(priceGroup),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deletePriceGroup', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { priceGroups, productCategories } = this.state;
        var rows = [];
        var index = 0;

        priceGroups.forEach((priceGroup) => {

            index = index + 1;
            let currentProductCategory;
            if (productCategories !== '' && productCategories !== null && productCategories !== undefined) {
                productCategories.forEach(productCategory => {
                    if (productCategory.id === priceGroup.product_category_id) {
                        currentProductCategory = productCategory.name
                    }
                });
            }
            rows.push(
                {
                    index: index,
                    name: priceGroup.name,
                    category: currentProductCategory,
                    buttons: <React.Fragment>
                        <Can I='read' a='PriceGroup'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleView(priceGroup.id)} className='m-1 py-1 px-2' outline color='info' size="sm"><MDBIcon icon="eye" /></MDBBtn>
                        </Can>
                        <Can I='update' a='PriceGroup'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(priceGroup.id)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can>
                        <Can I='delete' a='PriceGroup'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(priceGroup.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', },
                { label: 'Name', field: 'name' },
                { label: 'Product-Category', field: 'category', },
                { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (

            <Can I='read' a='PriceGroup'>
                <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                    <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                        Price Groups
                </MDBCardHeader>
                    <MDBCardBody className='p-2'>

                        <MDBDataTable id='priceGroupsTable' striped small hover theadColor="dark"
                            bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                            data={data} theadTextWhite >
                        </MDBDataTable>
                        <EditPriceGroupModal
                            ref='editPriceGroupModal'
                        />
                        <ViewPriceGroupModal
                            ref='viewPriceGroupModal'
                        />
                        <DeleteModal
                            ref='deleteModal'
                            deleteEntry={this.deletePriceGroup}
                        />
                    </MDBCardBody>
                </MDBCard>
            </Can>
        );
    }

}

export default AllPriceGroups
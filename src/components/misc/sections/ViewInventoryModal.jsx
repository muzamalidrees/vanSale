import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBCard, MDBCardBody, MDBModalHeader, MDBCardHeader, MDBDataTable } from 'mdbreact';



class ViewInventoryModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            user: '',
            roles: [],
            products: [],
            inventories: [],
            person: ''
        }
    }
    fetchData = (id) => {
        this._isMounted = true
        fetch('/getSpecificUser/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                var user = json.data
                if (this._isMounted === true) {
                    this.setState({
                        user: user,
                    })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllRoles')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                this.getData(json.data)
            })
            .catch((error) => console.log(error))

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted === true) {
                    this.setState({
                        products: json.data
                    })
                }
            })
            .catch((error) => console.log(error))

    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,

        });
    }

    getData = (roles) => {
        let { user } = this.state
        let person;
        roles.forEach(role => {
            if (role.id === user.role_id) {
                person = role.name;
            }
        });
        if (person === 'driver') {
            this._isMounted = true
            fetch('/getSpecificDriverInventory/' + user.id)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({
                            inventories: json.data,
                            person: 'Driver'
                        })
                    }
                })
        }
        else {
            this._isMounted = true
            fetch('/getSpecificLocationInventory/' + user.id)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json)
                    if (this._isMounted === true) {
                        this.setState({
                            inventories: json.data,
                            person: 'Operator'
                        })
                    }
                })
        }
    }




    render() {

        const { user, products, inventories, person } = this.state
        var index = 0;
        var rows = [];
        var data;
        if (inventories !== '' || inventories !== null || inventories !== undefined) {
            inventories.forEach((inventory) => {
                index = index + 1;
                let Product;
                if (products !== '' && products !== null && products !== undefined) {
                    products.forEach(product => {
                        if (product.id === inventory.product_id) {
                            Product = product.name
                        }
                    });
                }
                rows.push(
                    {
                        index: index,
                        name: user.name,
                        product: Product,
                        qty: inventory.qty,
                    }
                );
            });
            data = {
                columns: [
                    { label: '#', field: 'index', },
                    { label: `${person}`, field: 'name' },
                    { label: 'Product', field: 'product', },
                    { label: 'Qty.', field: 'qty', },
                ],
                rows: rows
            }
        }

        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' centered>
                    <MDBModalHeader toggle={this.toggle}> </MDBModalHeader>
                    <MDBModalBody>
                        <MDBCard className=' p-0'>
                            <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                                This {person}'s all inventory
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>
                                <MDBDataTable id='personalInventoryTable' striped small hover theadColor="dark"
                                    bordered btn entries={15} entriesOptions={[10, 20, 35, 55, 70, 100, 135]} responsive
                                    data={data} theadTextWhite >
                                </MDBDataTable>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default ViewInventoryModal;
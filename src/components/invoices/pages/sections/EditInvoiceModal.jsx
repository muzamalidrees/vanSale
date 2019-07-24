import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBTable, MDBTableHead, MDBTableBody, MDBModalHeader, MDBModalFooter, MDBRow, MDBCol, MDBInput } from 'mdbreact';
import Select from 'react-select';
import CreateableSelect from '../../../misc/sections/CreatableAdvancedSelect';
import PTableRow from '../../../misc/sections/PTableRow';
import DeleteModal from '../../../misc/sections/DeleteModal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';



const sourceOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'whatsapp1', label: 'WhatsApp 1' },
    { value: 'whatsapp2', label: 'WhatsApp 2' },
    { value: 'phone1', label: 'Phone 1' },
    { value: 'phone2', label: 'Phone 2' },
    { value: 'website', label: 'Website' },
    { value: 'imo', label: 'Imo' },
];

class EditOrderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            order_id: '',
            orderDate: '',
            orderTotal: 0,
            totalValueAdded: 0,
            orderSource: '',
            orderStatus: '',
            orderTracking: '',
            orderNote: '',
            cName: '',
            cContact: '',
            cAddress: '',
            orderId: 1,
            rows: [],
            price: '',
            i: '',
            pChecked: '',
            showAddProductToggleButton: true,
            showAddProductForm: false,
            npName: '',
            npSKU: '',
            npRate: '',
            npQTY: '',
            npRemarks: '',
            orderDetails: []
        }
    }

    //fetching all data to be showed in modal

    fetchData = (id) => {

        fetch('/getSpecificOrder/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                let order = json.data
                let date;
                if (order.date === null) {
                    date = new Date("2019-07-09T00:00:00.000Z")
                }
                else {
                    date = new Date(order.date)
                }
                console.log(date);

                this.setState({
                    orderId: order.id,
                    order_id: order.order_id,
                    orderDate: date,
                    orderTotal: parseInt(order.total),
                    totalValueAdded: parseInt(order.total_value_added),
                    orderSource: { label: order.source, value: order.source },
                    orderStatus: { label: order.status, value: order.status },
                    orderTracking: order.tracking_id,
                    orderNote: order.note,
                    cName: order.customer_name,
                    cContact: order.customer_contact,
                    cAddress: order.customer_address,
                })

                this.refs.createableSelect.setState({ value: { label: order.status, value: order.status } })
            })
            .catch((error) => console.log(error))

        fetch('/getAllOrderDetails/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                // json.data.map((x) => {
                //     delete x.createdAt;
                //     delete x.updatedAt;
                //     delete x.deletedAt;
                //     delete x.order_id;
                // });
                // this.setState({
                //     orderDetails: json.data,
                // }, function () {
                //     console.log(this.state.orderDetails);

                // })
                // console.log(json.data);
                
                this.setRows(json.data);
            })
            .catch((error) => console.log(error))
    }

    //toggling modal

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,
            showAddProductToggleButton: !this.state.showAddProductToggleButton,
            showAddProductForm: !this.state.showAddProductForm,

        });
    }

    //handling order status value

    orderStatus = (newValue) => {
        if (newValue === null) {
            this.setState({
                isValidStatus: false, orderStatus: newValue
            })
        }
        else {
            this.setState({
                orderStatus: newValue, isValidStatus: true
            })
        }
    }

    //handling inputs values


    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //handling order source value

    handleSelectChange = selectedOption => {
        this.setState({
            orderSource: selectedOption
        })
    }

    // handling date value

    handleDateChange = (value) => {
        this.setState({
            orderDate: value
        });
    }

    //setting all data for rows

    setRows = (orderDetails) => {
        this.setState({
            rows: []
        })
        if (orderDetails !== undefined) {
            var index = 0;
            orderDetails.forEach(orderDetail => {
                let pChecked;
                index++;
                let Id = orderDetail.id
                let pName = orderDetail.product_name
                let pSKU = orderDetail.product_sku
                let pRate = orderDetail.product_rate
                let pQTY = orderDetail.product_qty
                let pPrice = orderDetail.product_price
                let pRemarks = orderDetail.product_remarks
                if (orderDetail.product_extra_added === "Yes") {
                    pChecked = true
                }
                else {
                    pChecked = false
                }
                this.pushRows(index, Id, pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked)

            });
        }
    }

    //pushing rows in table at frontend

    pushRows = (index, Id, pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked) => {

        var Rows = [];
        Rows.push(
            <PTableRow
                index={index}
                Id={Id}
                pName={pName}
                pSKU={pSKU}
                pRate={pRate}
                pQTY={pQTY}
                pPrice={pPrice}
                pRemarks={pRemarks}
                pChecked={pChecked}
                key={Math.random()}
                deleteProductFrmTbl={this.handleDeleteProductFrmTbl}
                minusFromTotal={this.minusFromTotal}
                addToTotal={this.addToTotal}
                minusFromTotalValueAdded={this.minusFromTotalValueAdded}
                addToTotalValueAdded={this.addToTotalValueAdded}
            />
        );
        this.setState(state => {
            var rows = [...state.rows, Rows]
            return {
                rows
            };
        });
    }

    //handlig delete modal

    handleDeleteProductFrmTbl = (price, i, pChecked) => {
        this.setState({
            price, i, pChecked
        })
        this.refs.deleteModal.setState({
            modalShow: true
        })
    }

    // deleting product from order

    deleteProductFrmTbl = () => {
        let { price, i, pChecked, orderId } = this.state

        //updating total values at frontend

        this.setState({
            orderTotal: this.state.orderTotal - parseInt(price)
        })
        if (pChecked === 'Yes') {
            this.setState({
                totalValueAdded: this.state.totalValueAdded - parseInt(price)
            })
        }

        //deleting row from table at frontend


        var rows = [...this.state.rows];
        rows.splice(i - 1, 1);
        this.setState({ rows });

        //deleting record from darabase

        const Table = document.getElementById('editProductsTable')
        const pId = Table.rows[i].cells[8].innerHTML;
        if (pId === null || pId === '' || pId === undefined) {
            return
        }
        let orderDetail = { id: pId }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(orderDetail),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteOrderDetail', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))

        //Updating Total values from database.

        let order = { price: parseInt(price), id: orderId, pChecked: pChecked }
        var options2 = {
            method: 'PUT',
            body: JSON.stringify(order),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/updateOrderTotal', options2)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }

    //updating order total values

    minusFromTotal = (value) => {
        this.setState({
            orderTotal: this.state.orderTotal - parseInt(value)
        })
    }

    minusFromTotalValueAdded = (value) => {
        this.setState({
            totalValueAdded: this.state.totalValueAdded - parseInt(value)
        })
    }

    addToTotal = (value) => {

        this.setState({
            orderTotal: this.state.orderTotal + parseInt(value)
        })
    }

    addToTotalValueAdded = (value) => {
        this.setState({
            totalValueAdded: this.state.totalValueAdded + parseInt(value)
        })
    }

    //Saving updates

    handleSubmit = () => {

        //checking validity

        let form = this.refs.myForm;
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
            return;
        }
        else if (this.state.orderDate === '' || this.state.orderDate === null) {
            let element = document.getElementById('datePicker')
            element.style.borderColor = 'red'
            return false;
        }
        else if (this.state.orderSource === '' || this.state.orderSource === null) {
            this.setState({
                orderSource: null
            })
            return false;
        }
        else if (this.state.orderStatus === '' || this.state.orderStatus === null) {
            this.refs.createableSelect.setState({ value: null })
            return false;
        }
        else {

            // updating order & order_details from database

            this.updateOrder();
            let Table = document.getElementById('editProductsTable');
            for (let index = 1; index < Table.rows.length; index++) {
                const pName = Table.rows[index].cells[1].innerHTML;
                const pSKU = Table.rows[index].cells[2].innerHTML;
                const pRate = Table.rows[index].cells[3].innerHTML;
                const pQTY = Table.rows[index].cells[4].innerHTML;
                const pPrice = Table.rows[index].cells[5].innerHTML;
                const pRemarks = Table.rows[index].cells[6].innerHTML;
                const pChecked = Table.rows[index].cells[7].innerHTML;
                const pId = Table.rows[index].cells[8].innerHTML;

                // adding new product in order

                if (pId === null || pId === '' || pId === undefined) {
                    this.addNewOrderDetail(pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked)
                }

                //updating existing product

                else {
                    this.updateOrderDetails(pId, pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked);
                }
            }
            // emptying table at frontend

            for (let index = Table.rows.length - 1; index > 0; index--) {
                Table.deleteRow(index);
            }

            // closing edit modal

            this.toggle()

            // refreshing all records table

            window.location.reload();
        }
    }

    updateOrder = () => {
        let orderId = this.state.orderId
        let source = this.state.orderSource.value;
        let order_id = this.state.order_id;
        let date = this.state.orderDate;
        let status = this.state.orderStatus.value;
        let tracking = this.state.orderTracking;
        let note = this.state.orderNote;
        let total = this.state.orderTotal;
        let totalAddedValue = this.state.totalValueAdded;
        let cName = this.state.cName;
        let cContact = this.state.cContact;
        let cAddress = this.state.cAddress;

        // console.log(orderId, order_id, date, source, status, tracking, note, total,
        //     totalAddedValue, cName);

        var order = {
            id: orderId, order_id: order_id, date: date, source: source, status: status, tracking: tracking, note: note, total: total,
            totalAddedValue: totalAddedValue, cName: cName, cContact: cContact, cAddress: cAddress
        }
        var options = {
            method: 'PUT',
            body: JSON.stringify(order),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/updateOrder', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }

    updateOrderDetails = (pId, pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked) => {
        // console.log(pId, pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked);
        let orderId = this.state.orderId;
        let orderDetail = { id: pId, order_id: orderId, pName: pName, pSKU: pSKU, pRate: pRate, pQTY: pQTY, pPrice: pPrice, pRemarks: pRemarks, pChecked: pChecked }
        var options = {
            method: 'PUT',
            body: JSON.stringify(orderDetail),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/updateOrderDetail', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }

    addNewOrderDetail = (pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked) => {
        let order_id = this.state.orderId;
        let orderDetail = { order_id: order_id, pName: pName, pSKU: pSKU, pRate: pRate, pQTY: pQTY, pPrice: pPrice, pRemarks: pRemarks, pChecked: pChecked }
        var options = {
            method: 'POST',
            body: JSON.stringify(orderDetail),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/addNewOrderDetails', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }

    //toggling add product form

    addProductToggle = () => {
        this.setState({
            showAddProductForm: true,
            showAddProductToggleButton: false
        })

    }

    // handling add new product to table

    handleAddProduct = (e) => {
        e.preventDefault();

        // checking validity

        let form = this.refs.nproductForm;
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else {
            let npName = this.state.npName;
            let npSKU = this.state.npSKU;
            let npRate = this.state.npRate;
            let npQTY = this.state.npQTY
            let npPrice = this.npPrice.value;
            let npRemarks = this.state.npRemarks;
            let npChecked = (this.ncheckbox.checked) ? true : false
            let index = this.state.rows.length + 1

            this.pushRows(index, null, npName, npSKU, npRate, npQTY, npPrice, npRemarks, npChecked)

            this.addToTotal(npPrice)
            if (npChecked) {
                this.addToTotalValueAdded(npPrice)
            }

            this.setState({
                npName: '',
                npSKU: '',
                npRate: '',
                npQTY: '',
                npRemarks: ''
            })
            this.ncheckbox.checked = false;
        }
    }






    render() {
        const {
            orderSource, orderDate, showAddProductForm, showAddProductToggleButton,
            npName, npSKU, npRate, npQTY, npRemarks
        } = this.state

        const customStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : orderSource !== null ?
                        '#ddd' : 'red',
                width: '207px'
            })
        }


        return (
            <MDBContainer >
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit Order</MDBModalHeader>
                    <MDBModalBody >

                        {/* delete confirmation model */}

                        <DeleteModal
                            ref='deleteModal'
                            deleteEntry={this.deleteProductFrmTbl}
                        />

                        <MDBRow center >
                            <MDBCol md="9" className='m-0 p-0'>

                                {/* Order details form */}

                                <form ref='myForm'>
                                    <fieldset className='legend-border'>
                                        <legend className='legend-border'>Order:</legend>
                                        <MDBRow className='m-0 p-0'>

                                            <MDBCol md='3' className='m-0 p-0' middle >
                                                <MDBInput name='order_id' onInput={this.handleInput} className='m-0 px-0' value={this.state.order_id} label='Id' required outline />
                                            </MDBCol>
                                            <MDBCol lg='5' className='m-0 p-0' middle >
                                                <React.Fragment>
                                                    <CreateableSelect
                                                        ref='createableSelect'
                                                        orderStatus={this.orderStatus}
                                                    />
                                                </React.Fragment>
                                            </MDBCol>
                                            <MDBCol lg='4' className='m-0 p-0' middle>
                                                <React.Fragment>
                                                    <Select
                                                        styles={customStyles}
                                                        value={orderSource}
                                                        onChange={this.handleSelectChange}
                                                        options={sourceOptions}
                                                        placeholder='Source'
                                                        isSearchable
                                                        className='my-auto'
                                                        isClearable
                                                    />
                                                </React.Fragment>
                                            </MDBCol>
                                        </MDBRow>

                                        <MDBRow center className='m-0 p-0' >

                                            <MDBCol md='4' className='m-0 p-0' middle >
                                                <DatePicker
                                                    id='datePicker'
                                                    selected={orderDate}
                                                    placeholderText='Date'
                                                    onChange={this.handleDateChange}
                                                    className='form-control'
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    dateFormat="dd/MM/yy"
                                                    required
                                                />
                                            </MDBCol>
                                            <MDBCol md='4' className='m-0 '>
                                                <MDBInput label="Tr. Id" value={this.state.orderTracking} name="orderTracking" onInput={this.handleInput} outline className='m-0' />
                                            </MDBCol>
                                            <MDBCol md='4' className='m-0 '>
                                                <MDBInput type='textarea' rows='1' label="Note" value={this.state.orderNote} name="orderNote" onInput={this.handleInput} outline className='m-0' />
                                            </MDBCol>
                                        </MDBRow>
                                    </fieldset>

                                    {/* Customer details */}

                                    <fieldset className='legend-border'>
                                        <legend className='legend-border'>Customer:</legend>
                                        <MDBRow className='m-0 p-0'>
                                            <MDBCol sm='3' className='m-0'>
                                                <MDBInput value={this.state.cName} onInput={this.handleInput} name="cName" className='m-0' label="Name" outline required validate />
                                            </MDBCol>
                                            <MDBCol sm='3' className='m-0'>
                                                <MDBInput value={this.state.cContact} onInput={this.handleInput} name="cContact" className='m-0' label="Contact" outline required validate />
                                            </MDBCol>
                                            <MDBCol sm='6' className='m-0'>
                                                <MDBInput value={this.state.cAddress} onInput={this.handleInput} name="cAddress" className='m-0' label="Address" outline required validate />
                                            </MDBCol>
                                        </MDBRow>
                                    </fieldset>
                                </form>

                                {/* Add product form */}

                                {showAddProductToggleButton ?
                                    <MDBBtn size='sm' onClick={this.addProductToggle.bind(this)} className='mx-auto' style={{ fontWeight: 'bold', fontSize: '11px' }} outline>Add Product</MDBBtn>
                                    : null}
                                {showAddProductForm ?
                                    <form className='m-0 p-0' ref='nproductForm' onSubmit={this.handleAddProduct} noValidate>

                                        <fieldset className='legend-border'>
                                            <legend className='legend-border'>Product:</legend>
                                            <MDBRow className='m-0 p-0'>
                                                <MDBCol sm='4' className='m-0'>
                                                    <MDBInput value={npName} type='text' label="Name" name="npName" onInput={this.handleInput} required validate outline className='mt-0 mb-0' style={{ marginRight: '4px' }} />
                                                </MDBCol>
                                                <MDBCol sm='4' className='m-0'>
                                                    <MDBInput value={npSKU} type='text' label="SKU" name="npSKU" onInput={this.handleInput} outline className='mt-0 mb-0' style={{ marginRight: '4px' }} />
                                                </MDBCol>
                                                <MDBCol sm='4' className='m-0'>
                                                    <MDBInput value={npRate} type='number' label="Rate" name="npRate" onKeyPress={this.onKeyPress} onInput={this.handleInput} required validate outline min='0' className='mt-0 mb-0' style={{ marginRight: '4px' }} />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className='m-0 p-0'>
                                                <MDBCol sm='4' className='m-0'>
                                                    <MDBInput value={npQTY} type='number' label="Qty" name="npQTY" onKeyPress={this.onKeyPress} onInput={this.handleInput} required validate outline className='mt-0 mb-0' style={{ marginRight: '4px' }} />
                                                </MDBCol>
                                                <MDBCol sm='4' className='m-0'>
                                                    <MDBInput value={npRate * npQTY} type='number' label='Price' hint="Price" inputRef={e => { this.npPrice = e }} disabled outline className='mt-0 mb-0' style={{ marginRight: '4px' }} />
                                                </MDBCol>
                                                <MDBCol sm='4' className='m-0'>
                                                    <MDBInput value={npRemarks} type='text' label="Remarks" name="npRemarks" onInput={this.handleInput} outline className='mt-0 mb-0' style={{ marginRight: '4px' }} />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className='m-0 p-0' end>
                                                <MDBCol sm='4' className='m-0'>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" ref={e => { this.ncheckbox = e }} />
                                                        <label className="form-check-label" >
                                                            Is extra added?
                                                    </label>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol sm='4' className='m-0' >
                                                    <MDBBtn type='submit' size='sm' className='mx-auto' style={{ fontWeight: 'bold', fontSize: '11px' }} outline>Add Product</MDBBtn>
                                                </MDBCol>
                                            </MDBRow>

                                        </fieldset>
                                    </form>
                                    : null}

                                {/* Order totals */}

                                <MDBRow center className='m-0 p-0' >
                                    <MDBCol sm='6' className='m-0'>
                                        <MDBInput value={this.state.orderTotal} label="Total" hint="Total" disabled className='m-0' style={{ fontWeight: 'bold' }} />
                                    </MDBCol>
                                    <MDBCol sm='6' className='m-0'>
                                        <MDBInput value={this.state.totalValueAdded} className='m-0' style={{ fontWeight: 'bold' }} label="Total value added" hint="Total value added" disabled />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className='m-0 p-0' end>
                                    <MDBCol sm='12' className='m-0 p-0' bottom >
                                        <label style={{ fontWeight: 'bold', textAlign: 'left' }}>Products:</label>
                                    </MDBCol>
                                </MDBRow>

                                {/* Order products table */}

                                <MDBTable id='editProductsTable' striped responsive bordered autoWidth>

                                    <MDBTableHead color='teal' textWhite >
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Product</th>
                                            <th>SKU</th>
                                            <th>Rate</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>Remarks</th>
                                            <th>Extra added</th>
                                            <th>Action</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {this.state.rows}
                                    </MDBTableBody>
                                </MDBTable>

                            </MDBCol>
                        </MDBRow>
                    </MDBModalBody>

                    {/* close and save buttons */}

                    <MDBModalFooter>
                        <MDBBtn size='sm' className='px-2 font-weight-bold' color="secondary" onClick={this.toggle}>Close</MDBBtn>
                        <MDBBtn size='sm' className='px-2 font-weight-bold' onClick={this.handleSubmit} outline color="primary">Save updates</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default EditOrderModal;
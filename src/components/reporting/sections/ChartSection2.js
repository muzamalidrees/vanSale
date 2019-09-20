import React, { Component } from 'react';
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBListGroup, MDBListGroupItem, MDBBadge, MDBIcon, MDBRow } from 'mdbreact';
import { Bar } from 'react-chartjs-2';
import Select from 'react-select'



class ChartSection2 extends Component {
    constructor() {
        super();
        this.state = {
            selectedYear: { label: `${new Date().getFullYear()}`, value: `${new Date().getFullYear()}`, key: '-9999' }
        }
    }

    barData = (year) => {
        let { sales, returns, invoices } = this.props,
            desiredSales = [], desiredReturns = [], desiredInvoices = [], saleData = [], returnData = [], invoiceData = [],
            desiredYear = Number(year.value), months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',]

        //getting desired transactions
        sales.forEach(sale => {
            if (new Date(sale.updatedAt).getFullYear() === desiredYear) {
                desiredSales.push(sale)
            }
        });
        returns.forEach(Return => {
            if (new Date(Return.updatedAt).getFullYear() === desiredYear) {
                desiredReturns.push(Return)
            }
        });
        invoices.forEach(invoice => {
            if (new Date(invoice.updatedAt).getFullYear() === desiredYear) {
                desiredInvoices.push(invoice)
            }
        });
        // console.log(desiredInvoices);
        // console.log(desiredReturns);
        // console.log(desiredSales);

        //getting desired data
        months.forEach((month, index) => {
            let total = 0
            desiredSales.forEach(sale => {
                if (new Date(sale.updatedAt).getMonth() === index) {
                    total += sale.price
                }
            });
            saleData.push(total)
        })
        months.forEach((month, index) => {
            let total = 0
            desiredReturns.forEach(Return => {
                if (new Date(Return.updatedAt).getMonth() === index) {
                    total += Return.price
                }
            });
            returnData.push(total)
        })
        months.forEach((month, index) => {
            let total = 0
            desiredInvoices.forEach(invoice => {
                if (new Date(invoice.updatedAt).getMonth() === index) {
                    total += invoice.total
                }
            });
            invoiceData.push(total)
        })

        let dataBar = {
            labels: months,
            datasets: [
                {
                    label: 'Sale',
                    data: saleData,//sale totals
                    backgroundColor: '#69f0ae',
                    borderWidth: 1,
                    borderColor: '#00C851'
                }, {
                    label: 'Return',
                    data: returnData,//return totals
                    backgroundColor: '#fff59d',
                    borderWidth: 1,
                    borderColor: '#ffbb33'
                }, {
                    label: 'Income',
                    data: invoiceData,//invoice totals
                    backgroundColor: '#b3e5fc',
                    borderWidth: 1,
                    borderColor: '#33b5e5'
                }
            ]
        }


        return dataBar
    }

    handleSelectChange = selectedOption => {
        // console.log(selectedOption);
        this.setState({
            selectedYear: selectedOption
        })
    }

    render() {
        let { selectedYear } = this.state
        let { sales, returns, invoices, users, drivers, operators, customers, products } = this.props

        const barChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    barPercentage: 0.9,
                    gridLines: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
        let yearOptions = []
        if (invoices !== undefined && invoices !== null && invoices.length !== 0) {
            let firstInvoiceYear = new Date(invoices[0].createdAt).getFullYear(), nextYear = new Date().getFullYear() + 1;
            for (let i = -1; firstInvoiceYear + i <= nextYear; i++) {
                yearOptions.push(
                    { label: `${firstInvoiceYear + i}`, value: `${firstInvoiceYear + i}`, key: `${i}` }
                )
            }
        }

        const selectStyles = {
            control: (base) => ({
                ...base,
                fontWeight: 470,
                borderTop: 'none',
                borderRight: 'none',
                borderLeft: 'none',
                borderRadius: 'none',
            })
        }



        return (

            <MDBRow className="mb-4">
                <MDBCol className="mb-4">
                    <MDBCard className="mb-4">
                        <MDBCardHeader color='mdb-color'>
                            Company Report By Year
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBRow start className='pl-3 my-0 py-0'>
                                <MDBCol lg='3' md='4' sm='8' xs='12' className='pl-3 my-0 py-0'>
                                    <Select
                                        styles={selectStyles}
                                        value={selectedYear}
                                        onChange={this.handleSelectChange}
                                        options={yearOptions}
                                        isSearchable
                                        isClearable
                                        className='m-0 p-0'
                                    >
                                    </Select>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <Bar data={this.barData(selectedYear)} height={500} responsive={true} options={barChartOptions} />
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className="mb-4">
                        <MDBCardHeader color='unique-color' className='text-center'>
                            Some other statistics
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBRow>
                                <MDBCol lg='4'>
                                    <MDBListGroup className="list-group-flush">
                                        <MDBListGroupItem color="success">
                                            Sale Transactions
                                            <MDBBadge color="success" pill className="float-right">
                                                {/* <MDBIcon fab icon="facebook-f" /> */}
                                                {sales.length}
                                            </MDBBadge>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem color='danger'>
                                            Return Transactions
                                            <MDBBadge color="danger" pill className="float-right">
                                                {returns.length}
                                            </MDBBadge>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem color='info'>
                                            Total Invoices
                                            <MDBBadge color="info" pill className="float-right">
                                                {invoices.length}
                                            </MDBBadge>
                                        </MDBListGroupItem>
                                    </MDBListGroup>
                                </MDBCol>
                                <MDBCol lg='4' middle>
                                    <MDBListGroup className="list-group-flush">
                                        <MDBListGroupItem color='warning'>
                                            Customers
                                            <MDBBadge color="warning" pill className="float-right">
                                                {customers.length}
                                            </MDBBadge>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem color='dark'>
                                            Products
                                            <MDBBadge color="dark" pill className="float-right">
                                                {products.length}
                                            </MDBBadge>
                                        </MDBListGroupItem>
                                    </MDBListGroup>
                                </MDBCol>
                                <MDBCol lg='4'>
                                    <MDBListGroup className="list-group-flush">
                                        <MDBListGroupItem color='primary'>
                                            Users
                                            <MDBBadge color="green" pill className="float-right">
                                                {users.length}
                                            </MDBBadge>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem color='secondary'>
                                            Drivers
                                            <MDBBadge color="pink" pill className="float-right">
                                                {drivers.length}
                                            </MDBBadge>
                                        </MDBListGroupItem>
                                        <MDBListGroupItem color='info'>
                                            Operators
                                            <MDBBadge color="teal" pill className="float-right">
                                                {operators.length}
                                            </MDBBadge>
                                        </MDBListGroupItem>
                                    </MDBListGroup>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow >
        )
    }

}

export default ChartSection2;


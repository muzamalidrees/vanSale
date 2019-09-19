import React, { Component } from 'react';
import { MDBCol, MDBCard, MDBCardBody, MDBDataTable, MDBCardHeader, MDBRow } from 'mdbreact';
import { Line, Pie, Doughnut } from 'react-chartjs-2';

class ChartSection1 extends Component {

    constructor(props) {
        super();
        this.state = {
            progressShow: false,
            sales: props.sales,
            returns: props.returns,
            invoices: props.invoices,
        }
    }


    setTabularFormData = (transactions, reportOn, reportBy) => {
        switch (reportOn) {
            case 'sale':
                this.setState({
                    sales: transactions,
                    returns: [],
                    invoices: [],
                })
                document.getElementById('reportingAllSalesTable').innerHTML += ` (selected ${reportBy})`
                document.getElementById('reportingAllReturnsTable').innerHTML = `All Returns`
                document.getElementById('reportingAllInvoicesTable').innerHTML += `All Invoices`
                break;
            case 'return':
                this.setState({
                    sales: [],
                    returns: transactions,
                    invoices: [],
                })
                document.getElementById('reportingAllSalesTable').innerHTML = `All Sales`
                document.getElementById('reportingAllReturnsTable').innerHTML += ` (selected ${reportBy})`
                document.getElementById('reportingAllInvoicesTable').innerHTML += `All Invoices`
                break;
            case 'total':
                this.setState({
                    sales: [],
                    returns: [],
                    invoices: transactions,
                })
                document.getElementById('reportingAllSalesTable').innerHTML = `All Sales`
                document.getElementById('reportingAllReturnsTable').innerHTML = `All Returns`
                document.getElementById('reportingAllInvoicesTable').innerHTML += ` (selected ${reportBy})`
                break;
            default:
                this.setState({
                    sales: [],
                    returns: [],
                    invoices: [],
                })
                document.getElementById('reportingAllSalesTable').innerHTML = `All Sales`
                document.getElementById('reportingAllReturnsTable').innerHTML = `All Returns`
                document.getElementById('reportingAllInvoicesTable').innerHTML += `All Invoices`
                break;
        }
    }

    makeTabularDataForm = (transactions, trType) => {
        let { customers, products, drivers } = this.props
        let index = 0, invoiceRows = [], otherRows = [], data
        if (transactions.length !== 0 && transactions !== undefined && transactions !== null) {
            if (trType !== 'invoices') {
                transactions.forEach((transaction) => {
                    index = index + 1;
                    let trDate = transaction.date === null ? '' : new Date(transaction.date).toLocaleDateString();
                    let Product, Customer;
                    if (products !== '' && products !== null && products !== undefined) {
                        products.forEach(product => {
                            if (product.id === transaction.product_id) {
                                Product = product.name
                            }
                        });
                    }
                    if (customers !== '' && customers !== null && customers !== undefined) {
                        customers.forEach(customer => {
                            if (customer.id === transaction.customer_id) {
                                Customer = customer.name
                            }
                        });
                    }
                    otherRows.push(
                        {
                            index: index,
                            invoice_id: transaction.invoice_id,
                            customer: Customer,
                            date: trDate,
                            pName: Product,
                            pRate: transaction.rate,
                            pQty: transaction.qty,
                            pPrice: transaction.price,
                        }
                    );
                });
                data = {
                    columns: [
                        { label: '#', field: 'index', }, { label: 'Invoice_Id', field: 'invoice_id', },
                        { label: 'Customer', field: 'customer', }, { label: 'Date', field: 'date', },
                        { label: 'Product', field: 'pName' }, { label: 'Rate', field: 'pRate', },
                        { label: 'Qty.', field: 'pQty', }, { label: 'Price', field: 'pPrice', },
                    ],
                    rows: otherRows
                }
                return data
            }
            else {
                transactions.forEach((invoice) => {
                    index = index + 1;
                    let currentCustomer, invoiceDate, currentDriver
                    if (customers !== '' && customers !== null && customers !== undefined) {
                        customers.forEach(customer => {
                            if (customer.id === invoice.customer_id) {
                                currentCustomer = customer.name
                            }
                        });
                    }
                    if (drivers !== '' && drivers !== null && drivers !== undefined) {
                        drivers.forEach(driver => {
                            if (driver.id === invoice.driver_id) {
                                currentDriver = driver.name
                            }
                        });
                    }
                    if (invoice.date === null) {
                        invoiceDate = '';
                    }
                    else {
                        invoiceDate = new Date(invoice.date).toLocaleDateString();
                    }
                    invoiceRows.push(
                        {
                            index: index,
                            date: invoiceDate,
                            customer: currentCustomer,
                            driver: currentDriver,
                            total: invoice.total,
                        }
                    );
                });
                data = {
                    columns: [
                        { label: '#', field: 'index', }, { label: 'Date', field: 'date', },
                        { label: 'Customer', field: 'customer', }, { label: 'Driver', field: 'driver' },
                        { label: 'Total', field: 'total', },
                    ],
                    rows: invoiceRows
                }
                return data
            }
        }
    }

    dataPie = () => {
        let driverNames = [], driverIncomes = [], { drivers, invoices } = this.props
        drivers.forEach(driver => {
            let income = 0
            driverNames.push(driver.name)
            invoices.forEach(invoice => {
                if (invoice.driver_id === driver.id) {
                    income += invoice.total
                }
            })
            driverIncomes.push(income)
        })
        let data = {
            labels: driverNames,
            datasets: [
                {
                    data: driverIncomes,
                    backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#ac64ad'],
                    hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774', '#da92db']
                }
            ]
        }
        return data
    }

    dataDoughnut = () => {
        let customerNames = [], customerIncomes = [], { customers, invoices } = this.props
        customers.forEach(customer => {
            let income = 0
            customerNames.push(customer.name)
            invoices.forEach(invoice => {
                if (invoice.customer_id === customer.id) {
                    income += invoice.total
                }
            })
            customerIncomes.push(income)
        })
        let data = {
            labels: customerNames,
            datasets: [
                {
                    data: customerIncomes,
                    backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#ac64ad'],
                    hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774', '#da92db']
                }
            ]
        }
        return data
    }


    render() {
        let { sales, returns, invoices } = this.state
        let Invoices = this.props.invoices
        let { progressShow } = this.state
        // console.log(progressShow);
        // console.log(sales, returns, invoices)
        // console.log(Invoices)

        let incomeData = [], years = [];
        if (Invoices !== undefined && Invoices !== null && Invoices.length !== 0) {
            let firstInvoiceYear = new Date(Invoices[0].createdAt).getFullYear()
            let lastInvoiceYear = new Date(Invoices[Invoices.length - 1].updatedAt).getFullYear()
            Invoices.forEach(invoice => {
                if (new Date(invoice.updatedAt).getFullYear() < firstInvoiceYear) {
                    firstInvoiceYear = new Date(invoice.updatedAt).getFullYear()
                }
                if (new Date(invoice.updatedAt).getFullYear() > lastInvoiceYear) {
                    lastInvoiceYear = new Date(invoice.updatedAt).getFullYear()
                }
            })
            for (let i = firstInvoiceYear; i <= lastInvoiceYear; i++) {
                years.push(i)
            }
            years.forEach(year => {
                let total = 0
                let desired = Invoices.filter(invoice => new Date(invoice.updatedAt).getFullYear() === year)
                desired.forEach(invoice => {
                    total += invoice.total
                })
                incomeData.push(total)
            })
        }
        let dataLine = {
            labels: years,
            datasets: [
                {
                    label: "Income",
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: "rgba(225, 204,230, .3)",
                    borderColor: "rgb(205, 130, 158)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgb(205, 130,1 58)",
                    pointBackgroundColor: "rgb(255, 255, 255)",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgb(0, 0, 0)",
                    pointHoverBorderColor: "rgba(220, 220, 220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: incomeData
                }
            ]
        }


        return (
            <MDBRow className="mb-4">
                <MDBCol md="7" className="mb-4">
                    <MDBCard className="mb-4">
                        <MDBCardHeader id='reportingAllSalesTable' color='success-color'>
                            All Sales
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBDataTable striped small hover theadColor="dark"
                                bordered btn entries={5} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                                data={
                                    !progressShow && sales.length !== 0 ?
                                        this.makeTabularDataForm(sales, 'sales') : this.makeTabularDataForm(sales, 'sales')
                                } theadTextWhite >
                            </MDBDataTable>
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className="mb-4">
                        <MDBCardHeader id='reportingAllReturnsTable' color='warning-color'>
                            All Returns
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBDataTable striped small hover theadColor="dark"
                                bordered btn entries={5} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                                data={
                                    !progressShow && returns.length !== 0 ?
                                        this.makeTabularDataForm(returns, 'returns') : this.makeTabularDataForm(returns, 'returns')
                                } theadTextWhite >
                            </MDBDataTable>
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className="mb-4">
                        <MDBCardHeader id='reportingAllInvoicesTable' color='info-color'>
                            All Invoices
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBDataTable striped small hover theadColor="dark"
                                bordered btn entries={5} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                                data={
                                    !progressShow && invoices.length !== 0 ?
                                        this.makeTabularDataForm(invoices, 'invoices') : this.makeTabularDataForm(invoices, 'invoices')
                                } theadTextWhite >
                            </MDBDataTable>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

                <MDBCol md="5" className="mb-4">
                    <MDBCard className="mb-4">
                        <MDBCardHeader color='info-color'>All Drivers' Income</MDBCardHeader>
                        <MDBCardBody>
                            <Pie data={this.dataPie()} height={251} options={{ responsive: true }} />
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className="mb-4">
                        <MDBCardHeader color='info-color'>All Customers' Income</MDBCardHeader>
                        <MDBCardBody>
                            <Doughnut data={this.dataDoughnut()} height={251} options={{ responsive: true }} />
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className="mb-4">
                        <MDBCardHeader color='info-color'>Total Income</MDBCardHeader>
                        <MDBCardBody>
                            <Line data={dataLine} height={251} options={{ responsive: true }} />
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        )
    }
}

export default ChartSection1;


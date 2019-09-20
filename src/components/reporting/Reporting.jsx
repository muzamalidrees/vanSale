import React from 'react';
import AdminCardSection1 from './sections/AdminCardSection1';
import AdminCardSection2 from './sections/AdminCardSection2';
import BreadcrumSection from './sections/BreadcrumSection';
import ChartSection1 from './sections/ChartSection1';
import ChartSection2 from './sections/ChartSection2';
import { Can } from '../../configs/Ability-context';
import LoaderModal from '../misc/sections/LoaderModal';



let users = [], roles = [], sales = [], returns = [], invoices = [], customers = [], products = [],
  calls = [
    { path: '/getAllUsers' },
    { path: '/getAllRoles' },
    { path: '/getAllSales' },
    { path: '/getAllReturns' },
    { path: '/getAllInvoices' },
    { path: '/getAllCustomers' },
    { path: '/getAllProducts' },
  ]

class Reporting extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      users: [],
      roles: [],
      sales: [],
      returns: [],
      invoices: [],
      customers: [],
      products: [],
      reportOn: 'Net Income',
      reportBy: 'Your Company',
      selectedEntity: 'OverAll',
      fromDate: 'Beginning',
      toDate: 'Today',
      show: false
    }
    this._isMounted = true
    this.dataRequests = calls.map(call => fetch(call.path))
    Promise.all(this.dataRequests)
      .then(responses => {

        //getting responses from data requests
        Promise.all(responses.map(res =>
          res.json()
        ))
          .then(jsons => {

            //initializing all data
            users = jsons[0].data
            roles = jsons[1].data
            sales = jsons[2].data
            returns = jsons[3].data
            invoices = jsons[4].data
            customers = jsons[5].data
            products = jsons[6].data
            if (this._isMounted) {
              this.setState({
                users: users,
                roles: roles,
                sales: sales,
                returns: returns,
                invoices: invoices,
                customers: customers,
                products: products,
                show: true
              })
            }
          })
      })
  }

  makeReport = (reportOn, reportBy, selectedEntity, fromDate, toDate) => {
    // console.log(reportOn, reportBy, selectedEntity, fromDate, toDate);
    this.setState({
      reportOn: reportOn,
      reportBy: reportBy,
      selectedEntity: selectedEntity,
      fromDate: new Date(fromDate).toLocaleDateString(),
      toDate: new Date(toDate).toLocaleDateString(),
    })
    this.refs.adminCard1.makeSpecificReport(reportOn, reportBy, selectedEntity, fromDate, toDate);
  }


  setTabularFormData = (transactions, reportOn, reportBy) => {
    this.refs.chartSection1.setTabularFormData(transactions, reportOn, reportBy);
  }

  render() {
    let { show, users, roles, customers, products, sales, returns, invoices, reportOn, reportBy, selectedEntity, fromDate, toDate } = this.state

    let drivers = [], operators = []
    if (users !== undefined && users !== null && users.length !== 0) {
      users.forEach(user => {
        let userRole;
        roles.forEach(role => {
          if (role.id === user.role_id) {
            userRole = role.name
          }
        });
        if (userRole !== undefined) {
          userRole === 'driver' ?
            drivers.push(user) :
            userRole === 'operator' ?
              (operators.push(user)) :
              console.log()
        }
      })
    }
    let SelectedEntity = selectedEntity
    if (reportBy === 'driver') {
      drivers.forEach(driver => {
        SelectedEntity = driver.id === selectedEntity ? driver.name : 'unknown'
      })
    }
    else if (reportBy === 'customer') {
      customers.forEach(customer => {
        SelectedEntity = customer.id === selectedEntity ? customer.name : 'unknown'
      })
    }
    else if (reportBy === 'product') {
      products.forEach(product => {
        SelectedEntity = product.id === selectedEntity ? product.name : 'unknown'
      })
    }



    return (
      <>
        {show ?
          <Can I='read' a='report' >
            <React.Fragment >
              <BreadcrumSection
                drivers={drivers}
                operators={operators}
                customers={customers}
                products={products}
                makeReport={this.makeReport}
              />
              <div className='text-center mb-5'>
                <p className="note note-info">
                  You are viewing reports on  <strong>{reportOn}</strong> by {reportBy} <strong>{SelectedEntity}</strong> from {fromDate} to {toDate}.
                  </p>
              </div>
              <AdminCardSection1
                ref='adminCard1'
                sales={sales}
                returns={returns}
                invoices={invoices}
                drivers={drivers}
                operators={operators}
                customers={customers}
                products={products}
                setTabularFormData={this.setTabularFormData}
              />

              <ChartSection1
                ref='chartSection1'
                customers={customers}
                products={products}
                drivers={drivers}
                sales={sales}
                returns={returns}
                invoices={invoices}
              />
              <ChartSection2
                sales={sales}
                returns={returns}
                invoices={invoices}
                users={users}
                customers={customers}
                products={products}
                drivers={drivers}
                operators={operators}
              />
              <AdminCardSection2
                sales={sales}
                returns={returns}
                invoices={invoices}
              />
            </React.Fragment >
          </Can>
          :
          null}
        <LoaderModal
          show={!show}
        />
      </>
    )
  }
}

export default Reporting;
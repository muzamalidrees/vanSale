import React from 'react';
import { MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput } from 'mdbreact';
import Select from 'react-select'
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';


class CustomDateInput extends React.Component {
  render() {
    return (
      <MDBInput type='text' label={this.props.label} value={this.props.value} className='m-0 px-0' onClick={this.props.onClick} />
    )
  }
}

class BreadcrumSection extends React.Component {
  constructor() {
    super();
    this.state = {
      reportOn: null,
      reportBy: null,
      selectedEntity: null,
      reportOnOptions: [
        { label: 'Sale', value: 'sale', key: '1' },
        { label: 'Return', value: 'return', key: '2' },
        { label: 'Net Total', value: 'total', key: '3' }
      ],
      reportByOptions: [
        { label: 'Driver', value: 'driver', key: '1' },
        // { label: 'Operator', value: 'operator', key: '2' },
        { label: 'Customer', value: 'customer', key: '3' },
        { label: 'Product', value: 'product', key: '3' },
      ],
      fromDate: new Date(),
      toDate: new Date(),
    }
  }

  handleSelectChange = name => selectedOption => {
    let { reportOn, reportBy, fromDate, selectedEntity, toDate } = this.state
    this.setState({
      [name]: selectedOption
    })
    if (name === 'reportBy') {
      this.setState({ selectedEntity: null })
    }
    if (name === 'reportOn' && selectedOption !== null && selectedEntity !== null) {
      this.props.makeReport(selectedOption.value, reportBy.value, selectedEntity.value, fromDate, toDate)
    }
    if (name === 'selectedEntity' && selectedOption !== null && reportOn !== null) {
      this.props.makeReport(reportOn.value, reportBy.value, selectedOption.value, fromDate, toDate)
    }
  }

  handleDateChange = name => value => {
    let { reportOn, reportBy, fromDate, selectedEntity, toDate } = this.state
    this.setState({
      [name]: value
    });
    if (reportOn !== null && reportBy !== null && selectedEntity !== null) {
      if (name === 'fromDate') {
        this.props.makeReport(reportOn.value, reportBy.value, selectedEntity.value, value, toDate)
      }
      else {
        this.props.makeReport(reportOn.value, reportBy.value, selectedEntity.value, fromDate, value)
      }
    }
  }

  render() {
    let { reportOn, reportOnOptions, reportBy, reportByOptions, fromDate, toDate, selectedEntity } = this.state
    let { drivers, operators, customers, products } = this.props
    const selectStyles = {
      control: (base, state) => ({
        ...base,
        // borderColor: state.isFocused ?
        //   '#ffffff' : reportOn !== null ?
        //     '#ffffff' : 'red',
        fontWeight: 370,
        borderTop: 'none',
        borderRight: 'none',
        borderLeft: 'none',
        borderRadius: 'none',
      })
    }
    let label = reportBy !== null ? reportBy.value : undefined
    let entities = (label !== undefined) ?
      label === 'driver' ?
        drivers :
        label === 'operator' ?
          operators :
          label === 'customer' ?
            customers :
            label === 'product' ?
              products :
              undefined
      : undefined

    let entityOptions = (entities !== undefined) ?
      entities.map(entity => (({ key: entity.id, label: entity.name, value: entity.id }))) :
      []


    return (
      <MDBCard className="mb-5" style={{ marginTop: '75px' }}>
        <MDBCardBody id="breadcrumb" className="justify-content-between">
          <MDBRow style={{ color: 'black', fontWeight: 'bold' }} center>
            <MDBCol md='3' top>
              <MDBRow className='mt-1 mx-0 p-0'>
                View Reports On :
                <MDBCol md='12' className='m-0 p-0' >
                  <Select
                    styles={selectStyles}
                    value={reportOn}
                    onChange={this.handleSelectChange('reportOn')}
                    options={reportOnOptions}
                    isSearchable
                    isClearable
                  >
                  </Select>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <MDBCol md='2' top>
              <MDBRow className='mt-1 mx-0 p-0'>
                By :
                <MDBCol md='12' className='m-0 p-0'>
                  <Select
                    styles={selectStyles}
                    value={reportBy}
                    onChange={this.handleSelectChange('reportBy')}
                    options={reportByOptions}
                    isSearchable
                    isClearable
                  >
                  </Select>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <MDBCol md='4' top>
              <MDBRow className='m-0 p-0' top>
                <MDBCol md='6' className='m-0 p-0' top>
                  <DatePicker
                    selected={fromDate}
                    onChange={this.handleDateChange('fromDate')}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd/MM/yy"
                    autoComplete='off'
                    customInput={<CustomDateInput label='From' />}
                  />
                </MDBCol>
                <MDBCol md='6' className='m-0 p-0' top>
                  <DatePicker
                    selected={toDate}
                    onChange={this.handleDateChange('toDate')}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd/MM/yy"
                    autoComplete='off'
                    customInput={<CustomDateInput label='To' />}
                  />
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <MDBCol md='2' top className='m-0 p-0'>
              <MDBRow className='mt-1 mx-0 p-0'>
                Select {reportBy !== null ? reportBy.label : '.'}..
                <MDBCol md='12' className='m-0 p-0'>
                  <Select
                    styles={selectStyles}
                    value={selectedEntity}
                    onChange={this.handleSelectChange('selectedEntity')}
                    options={entityOptions}
                    isSearchable
                    isClearable
                  >
                  </Select>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    )
  }
}

export default BreadcrumSection;


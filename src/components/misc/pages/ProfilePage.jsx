import React, { Component } from 'react';
import { MDBCol, MDBRow, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBDataTable, MDBCardFooter, MDBBtn, MDBCardTitle, MDBCardText, MDBCardHeader } from 'mdbreact';


class ProfilePage extends Component {
  _isMounted = false
  constructor() {
    super();
    this.userId = localStorage.getItem('ui')
    this._isMounted = true
    fetch('/getSpecificUser/' + this.userId)
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        let user = json.data
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
        if (this._isMounted) {
          this.setState({ roles: json.data })
        }
      })
      .catch((error) => console.log(error))

    fetch('/getAllProducts')
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        if (this._isMounted) {
          this.setState({ products: json.data })
        }
      })
      .catch((error) => console.log(error))

    this.state = {
      user: '',
      roles: [],
      products: [],
      inventories: []
    }
  }

  setInventory = userRole  => (e) => {
    if (userRole === 'driver') {
      this._isMounted = true
      fetch('/getSpecificDriverInventory/' + this.state.user.id)
        .then((res) => res.json())
        .then((json) => {
          // console.log(json)
          if (this._isMounted === true) {
            this.setState({
              inventories: json.data,
            })
            document.getElementById('profileInventory').style.display = ''
          }
        })
    }
    else if (userRole === 'operator') {
      this._isMounted = true
      fetch('/getSpecificLocationInventory/' + this.state.user.id)
        .then((res) => res.json())
        .then((json) => {
          // console.log(json)
          if (this._isMounted === true) {
            this.setState({
              inventories: json.data,
            })
            document.getElementById('profileInventory').style.display = ''
          }
        })
    }
  }


  render() {
    const { user, roles, inventories, products } = this.state
    let userRole;
    if (roles .length!==0 && roles !== undefined) {
      roles.forEach(role => {
        if (role.id === user.role_id) {
          userRole = role.name
        }
      })
    }

    var index = 0;
    var rows = [];
    var data;
    if (inventories !== '' && inventories !== null && inventories !== undefined) {
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
            product: Product,
            qty: inventory.qty,
          }
        );
      });
      data = {
        columns: [
          { label: '#', field: 'index', },
          { label: 'Product', field: 'product', },
          { label: 'Qty.', field: 'qty', },
        ],
        rows: rows
      }
    }

    return (

      <MDBContainer style={{ marginTop: '170px' }}>
        <MDBRow center className='m-0 p-0'>
          <MDBCol sm='5' className='mb-3 mx-0 px-0'>
            <MDBCard color='dark-color' border='dark' className=''>
              <MDBCardBody className='text-dark'>
                <MDBCardTitle tag="h2"> {user.name}</MDBCardTitle>
                <MDBCardText>
                  {user.email}
                </MDBCardText>
                <MDBRow className="">
                  <MDBCol>
                    <MDBInput
                      value={user.cell || ''}
                      label="Phone"
                      icon="phone"
                      group
                      type="text"
                      disabled
                    />
                    <MDBInput
                      value={user.address || ''}
                      label="Address"
                      icon="map-marker-alt"
                      group
                      type="text"
                      disabled
                    />
                    <MDBInput
                      value={user.username}
                      label="Username"
                      icon="user"
                      group
                      type="text"
                      disabled
                    />
                    <MDBInput
                      value={user.password}
                      label="Password"
                      icon="lock"
                      group
                      type="text"
                      disabled
                    />
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
              {userRole === 'driver' || userRole === 'operator'
                ?
                <MDBCardFooter transparent border="dark" className='text-center'>
                  <MDBBtn
                    color="dark"
                    size='sm'
                    onClick={this.setInventory(userRole)}
                  >
                    My Inventory
                  </MDBBtn>
                </MDBCardFooter>
                :
                null
              }
            </MDBCard>
          </MDBCol>
          <MDBCol sm='7' id='profileInventory' style={{ display: 'none' }}>
            <MDBCard color='dark-color' border='dark' className=''>
              <MDBCardHeader transparent border='dark' tag='h2' className='text-center text-dark'> Your Inventory</MDBCardHeader>
              <MDBCardBody className='text-dark px-1 mx-1'>
                <MDBDataTable id='personalInventoryTable' striped small hover theadColor="dark"
                  bordered btn entries={15} entriesOptions={[10, 20, 35, 55, 70, 100, 135]} responsive
                  data={data} theadTextWhite >
                </MDBDataTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    )
  }
}


export default ProfilePage
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewProduct from './SecuredNewProduct';
import SecuredAllProducts from './SecuredAllProducts';



class Products extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }

    render() {


        return (
            // <div>
            //     <h1 style={{ marginTop: '80px' }}>
            //         Products Page
            //     </h1>
            // </div>
            <Switch>
                <Route path="/products/new" component={SecuredNewProduct} />
                <Route path="/Products/all" component={SecuredAllProducts} />
            </Switch>

        )
    }
}


export default Products
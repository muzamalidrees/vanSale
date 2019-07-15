import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewProductCategory from './SecuredNewProductCategory';
import SecuredAllProductCategories from './SecuredAllProductCategories';



class ProductCategories extends Component {
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
            //         ProductCategories Page
            //     </h1>
            // </div>
            <Switch>
                <Route path="/productCategories/new" component={SecuredNewProductCategory} />
                <Route path="/productCategories/all" component={SecuredAllProductCategories} />
            </Switch>

        )
    }
}


export default ProductCategories
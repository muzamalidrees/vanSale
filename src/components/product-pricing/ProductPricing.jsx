import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SecuredSetProdcutPrices from './SecuredSetProductPrices';
import AllProductPrices from './pages/AllProductPrices';



class ProductPricing extends Component {

    render() {


        return (

            <Switch>
                <Route path="/productPricing/new" component={SecuredSetProdcutPrices} />
                <Route path="/productPricing/all" component={AllProductPrices} />
            </Switch>

        )
    }
}


export default ProductPricing
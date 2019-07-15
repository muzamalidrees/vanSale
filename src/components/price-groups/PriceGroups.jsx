import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewPriceGroup from './SecuredNewPriceGroup';
import SecuredAllPriceGroups from './SecuredAllPriceGroups';



class PriceGroups extends Component {
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
            //         Users Page
            //     </h1>
            // </div>
            <Switch>
                <Route path="/priceGroups/new" component={SecuredNewPriceGroup} />
                <Route path="/priceGroups/all" component={SecuredAllPriceGroups} />
            </Switch>

        )
    }
}


export default PriceGroups
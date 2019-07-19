import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredAllSales from './SecuredAllSales';



class Sales extends Component {
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
            //         Orders Page
            //     </h1>
            // </div>
            <Switch>
                <Route path="/sales/all" component={SecuredAllSales} />
            </Switch>

        )
    }
}


export default Sales
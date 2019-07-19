import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewReturn from './SecuredNewReturn';
import SecuredAllReturns from './SecuredAllReturns';


class Returns extends Component {
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
                <Route path="/returns/new" component={SecuredNewReturn} />
                <Route path="/returns/all" component={SecuredAllReturns} />
            </Switch>

        )
    }
}


export default Returns
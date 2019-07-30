import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewOperator from './SecuredNewOperator';
import SecuredAllOperators from './SecuredAllOperators';



class Operators extends Component {
    constructor() {
        super();
        this.state = {
        };
    }

    render() {


        return (
           
            <Switch>
                <Route path="/operators/new" component={SecuredNewOperator} />
                <Route path="/operators/all" component={SecuredAllOperators} />
            </Switch>

        )
    }
}


export default Operators
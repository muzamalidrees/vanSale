import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import NotFound from './pages/NotFound';
import SecuredLogin from '../auth/SecuredLogin';
import SecuredHome from '../home/SecuredHome';
import Users from '../users/Users';
import Roles from '../roles/Roles';




class Routes extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }


    // componentDidMount() {
    //     this.timerID = setInterval(() => this.tick(), 1000);
    // }
    // componentWillUnmount() {
    //     clearInterval(this.timerID);
    // }
    // tick = () => {
    //     this.setState({ date: new Date() });
    // }

    render() {


        return (

            <div style={{}} className="container-fluid">
                <Switch>
                    <Route exact path="/" render={() => (<SecuredLogin changeUser={this.props.changeUser} />)} />
                    <Route exact path="/login" render={() => (<SecuredLogin changeUser={this.props.changeUser} />)} />
                    <Route path="/home" component={SecuredHome} />
                    <Route path="/users" component={Users} />
                    <Route path="/roles" component={Roles} />
                    <Route path='/' component={NotFound} pt='186px' pb='185px' class={'sol-sm-12'} />
                </Switch>
            </div>

        )
    }
}


export default Routes
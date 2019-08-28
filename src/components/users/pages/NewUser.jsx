import React, { Component } from 'react';
import { Can } from '../../../configs/Ability-context'
import NewPerson from '../../misc/pages/NewPerson'


class NewUser extends Component {


    render() {



        return (
            <Can I='create' a='user'>
                <NewPerson new={'User'} />
            </Can>
        );
    }
}


export default NewUser
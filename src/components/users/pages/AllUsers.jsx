import React, { Component } from 'react';
import { Can } from "../../../configs/Ability-context";
import AllPersons from '../../misc/pages/AllPersons';


class AllUsers extends Component {



    render() {

        return (
            <Can I='read' a='user'>
                <AllPersons all={'Users'} />
            </Can>
        );
    }

}

export default AllUsers
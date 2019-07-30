import React, { Component } from 'react';
import { Can } from "../../../configs/Ability-context";
import AllPersons from '../../misc/pages/AllPersons';


class AllUsers extends Component {



    render() {

        return (
            <AllPersons all={'Users'} />
        );
    }

}

export default AllUsers
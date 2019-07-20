import React, { Component } from 'react';
import { MDBBtn, MDBIcon } from 'mdbreact'


class PTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pRate: props.pRate,
            pQTY: props.pQTY,
            pPrice: props.pPrice
        };
        this.handleBlur = this.handleBlur.bind(this);
    }

    deleteRowfn(e) {
        let { tableId, containerId } = this.props
        let el = e.target
        let row = el.closest('tr')

        let i = row.rowIndex;
        let price = row.cells[5].innerHTML;
        this.props.deleteProductFrmTbl(price, i, tableId, containerId);

    }

    handleBlur = name => e => {
        let { pPrice } = this.state
        let { tableId } = this.props

        this.props.minusFromTotal(pPrice, tableId);

        var a = e.target.innerHTML
        this.setState({ [name]: a })
        this.setState(state => {
            let pPrice = [state.pRate * state.pQTY]
            return { pPrice }
        }, function () {
            this.props.addToTotal(parseInt(this.state.pPrice), this.props.tableId);
        })
    }
    onKeyPress = (e) => {
        // console.log((e.which));
        // console.log(String.fromCharCode(e.which));
        // console.log((isNaN(String.fromCharCode(e.which))));

        if (isNaN(String.fromCharCode(e.which))) e.preventDefault();
        if ((e.which) === 32 || (e.which) === 13) e.preventDefault();
    }

    render() {


        let { index, pId, pName, pRate, pQTY, trDate } = this.props

        return (

            <tr >
                <td>{index}</td>
                <td style={{ display: 'none' }}>{pId}</td>
                <td>{pName}</td>
                <td>{pRate}</td>
                <td suppressContentEditableWarning={true} onKeyPress={this.onKeyPress} onBlur={this.handleBlur('pQTY')} contentEditable='true'>{pQTY}</td>
                <td>{this.state.pPrice}</td>
                <td style={{ display: 'none' }}>{trDate.toString()}</td>
                <td>
                    <MDBBtn style={{ fontSize: '15px' }} onClick={this.deleteRowfn.bind(this)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                </td>
            </tr >
        );
    }
}


export default PTableRow
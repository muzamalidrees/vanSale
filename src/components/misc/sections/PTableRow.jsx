import React, { Component } from 'react';


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
        let el = e.target
        let row = el.closest('tr')

        let i = row.rowIndex;
        let price = row.cells[5].innerHTML;
        let pChecked = row.cells[7].innerHTML;

        this.props.deleteProduct(price, i, pChecked);

    }

    handleBlur = name => e => {

        this.props.minusFromTotal(this.state.pPrice);
        if (this.props.pChecked) {
            this.props.minusFromTotalValueAdded(this.state.pPrice);
        }
        var a = e.target.innerHTML
        this.setState({ [name]: a })
        this.setState(state => {
            var pPrice = [state.pRate * state.pQTY]
            return { pPrice }
        }, function () {
            this.props.addToTotal(parseInt(this.state.pPrice));
            if (this.props.pChecked) {
                this.props.addToTotalValueAdded(parseInt(this.state.pPrice));
            }
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
        var pName = this.props.pName;
        var pSKU = this.props.pSKU;
        var pRate = this.props.pRate;
        var pQTY = this.props.pQTY;
        var pRemarks = this.props.pRemarks;
        var pChecked = (this.props.pChecked) ? 'Yes' : 'No';
        var index = this.props.index;
        var id = this.props.Id

        return (

            <tr >
                <td>{index}</td>
                <td suppressContentEditableWarning={true} contentEditable='true'>{pName}</td>
                <td suppressContentEditableWarning={true} contentEditable='true'>{pSKU}</td>
                <td suppressContentEditableWarning={true} onKeyPress={this.onKeyPress} onBlur={this.handleBlur('pRate')} contentEditable='true'>{pRate}</td>
                <td suppressContentEditableWarning={true} onKeyPress={this.onKeyPress} onBlur={this.handleBlur('pQTY')} contentEditable='true'>{pQTY}</td>
                <td >{this.state.pPrice}</td>
                <td suppressContentEditableWarning={true} contentEditable='true'>{pRemarks}</td>
                <td>{pChecked}</td>
                <td style={{ display: 'none' }}>{id}</td>
                <td>
                    <button onClick={this.deleteRowfn.bind(this)} type='button' className=" btn-sm btn-dark mb-1">
                        <i className="fas fa-trash"></i>
                    </button>
                </td>
            </tr >
        );
    }
}


export default PTableRow
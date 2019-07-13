import React, { Component } from 'react';

import CreatableSelect from 'react-select/creatable';

type State = {
    options: [{ [string]: string }],
    value: string | void,
};

const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
});

const statusOptions = [
    createOption('Pending'),
    createOption('Dispatched'),
    createOption('Completed'),
];

export default class CreatableAdvancedSelect extends Component<*, State> {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            options: statusOptions,
            value: ''
        };
    }
    handleChange = (newValue) => {

        this.setState({ value: newValue });
        this.props.orderStatus(newValue);
    };
    handleCreate = (inputValue) => {
        this.setState({ isLoading: true });
        setTimeout(() => {
            const { options } = this.state;
            const newOption = createOption(inputValue);
            this.setState({
                isLoading: false,
                options: [...options, newOption],
                value: newOption,
            });
            this.props.orderStatus(newOption);
        }, 1000);

    };



    render() {
        const { isLoading, options, value } = this.state;

        const customStyles = {
            control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                    '#ddd' : value !== null ?
                        '#ddd' : 'red',
                width: '207px',
                // float: 'right',
            })
        }


        return (
            <CreatableSelect
                styles={customStyles}
                isClearable
                isSearchable
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={this.handleChange}
                onCreateOption={this.handleCreate}
                options={options}
                value={value}
                placeholder='Status'
            />
        );
    }
}

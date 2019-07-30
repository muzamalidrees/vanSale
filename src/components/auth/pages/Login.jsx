import React from "react";
import { Redirect } from 'react-router'
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false,
            user: ''
        }
        this.handleLogin = this.handleLogin.bind(this);
    }
    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    validateLogin = (e) => {
        e.preventDefault();
        let form = this.refs.myForm;
        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
        }
        else {
            this.handleLogin();
        }
    }
    handleLogin = () => {
        var options = {
            method: 'POST',
            body: JSON.stringify({ username: this.state.username, password: this.state.password }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch('/auth', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json);
                let message = json.message;
                this.refs.loginLabel.innerHTML = message;
                if (message === 'incorrect password') {
                    this.password.value = "";
                    this.password.focus();
                }
                else if (message === `username doesn't exist`) {
                    this.username.value = '';
                    this.username.focus();
                }
                else {
                    this.setState({
                        isLoggedIn: true,
                        user: json.user
                    }, function () {
                        if (typeof (Storage) !== "undefined") {
                            localStorage.setItem('uri', JSON.stringify(json.user.id))
                            localStorage.setItem('ui', JSON.stringify(json.user.role_id))
                        }
                        else {
                            alert('Please use another browser to get it working correctly.')
                        }
                    })
                    // console.log(json.user.role_id);
                    let user = json.user.role_id

                    this.props.changeUser(user);

                }

            })
            .catch((err) => console.log(err))
    }





    onChangeLabel = () => {
        this.refs.loginLabel.innerHTML = '';
    }


    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to='/home' />
        }
        else
            return (
                <MDBContainer className=" mt-5 pt-5">
                    <MDBRow className=" mt-5 pt-5">
                        <MDBCol md="6" className='mx-auto'>
                            <form ref='myForm' onSubmit={this.validateLogin} noValidate>
                                <p className="h5 text-center mb-4">Sign in</p>
                                <div className="grey-text">
                                    <MDBInput
                                        label="Username"
                                        name="username"
                                        icon="user"
                                        value={this.state.username}
                                        onInput={this.handleInput}
                                        onChange={this.onChangeLabel}
                                        group
                                        type="text"
                                        error="wrong"
                                        success="right"
                                        inputRef={ref => this.username = ref}
                                        required
                                        validate>
                                        <div className="valid-feedback">
                                            Looks good!
                                    </div>
                                        <div className="invalid-feedback">
                                            Please provide a Name.
                                    </div>
                                    </MDBInput>
                                    <MDBInput
                                        label="Password"
                                        name="password"
                                        icon="lock"
                                        value={this.state.password}
                                        onInput={this.handleInput}
                                        inputRef={ref => this.password = ref}
                                        onChange={this.onChangeLabel}
                                        group
                                        type="password"
                                        required
                                        validate>
                                        <div className="valid-feedback">
                                            Looks good!
                                    </div>
                                        <div className="invalid-feedback">
                                            Please provide a Password.
                                    </div>
                                    </MDBInput>
                                </div>
                                <label ref='loginLabel' style={{ color: 'red' }}></label>
                                <div className="text-center">
                                    <MDBBtn color='dark' type="submit">Login</MDBBtn>
                                </div>
                            </form>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            )

    }
}
export default LoginForm;
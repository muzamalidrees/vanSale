import React, { Component } from 'react';
import { Can } from '../../../configs/Ability-context'
import Sidebar from "react-sidebar";
import { MDBBtn, MDBIcon } from 'mdbreact';


const mql = window.matchMedia(`(min-width: 800px)`);
class ReactSideBar extends Component {
    _isMounted = false
    constructor() {
        super();

        this.state = {
            sidebarDocked: mql.matches,
            sidebarOpen: false,
            displayBtn: true
        }
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    }

    onSetSidebarOpen(open) {
        console.log('setSidebaropen');
        
        this.setState({ sidebarOpen: open, displayBtn: !this.state.displayBtn });
    }

    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
    }

    componentWillUnmount = () => {
        this._isMounted = false
        mql.removeListener(this.mediaQueryChanged);
    }

    mediaQueryChanged() {

        this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
    }


    render() {
        var styles = {
            root: {
                position: "absolute",
                top: 66,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden"
            },
            sidebar: {
                zIndex: 2,
                position: "absolute",
                width: '15%',
                top: 0,
                bottom: 0,
                transition: "transform .3s ease-out",
                WebkitTransition: "-webkit-transform .3s ease-out",
                willChange: "transform",
                overflowY: "auto"
            },
            content: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                transition: "left .3s ease-out, right .3s ease-out"
            },
            overlay: {
                zIndex: 1,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0,
                visibility: "hidden",
                transition: "opacity .3s ease-out, visibility .3s ease-out",
                backgroundColor: "rgba(0,0,0,.3)"
            },
            dragHandle: {
                zIndex: 1,
                position: "fixed",
                top: 0,
                bottom: 0
            }
        };
        return (
            <Sidebar
                sidebar={
                    <li>
                        <ul className="social">
                            <li>
                                <a href="#!">
                                    <MDBIcon fab icon="facebook-f" />
                                </a>
                            </li>
                            <li>
                                <a href="#!">
                                    <MDBIcon fab icon="pinterest" />
                                </a>
                            </li>
                            <li>
                                <a href="#!">
                                    <MDBIcon fab icon="google-plus-g" />
                                </a>
                            </li>
                            <li>
                                <a href="#!">
                                    <MDBIcon fab icon="twitter" />
                                </a>
                            </li>
                        </ul>
                    </li>
                }
                open={this.state.sidebarOpen}
                docked={this.state.sidebarDocked}
                onSetOpen={this.onSetSidebarOpen}
                styles={styles}
            >
                {!this.state.sidebarDocked ?
                    <MDBBtn id='btn' size='lg' color='dark' className='px-2 py-1' onClick={() => this.onSetSidebarOpen(true)} style={this.state.displayBtn ? { display: '' } : { display: 'none' }}>
                        <MDBIcon className='m-0 p-0' style={{ fontSize: '30px' }} icon='bars' />
                    </MDBBtn>
                    : null}

            </Sidebar>
        );
    }

}

export default ReactSideBar
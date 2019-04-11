import React, { Component } from 'react'
import '../App.css';



class AdminLayout extends Component {

    constructor(props){
        super(props)
        this.state ={
            account : '0x0',
            balance : '',
        }
    }
    
    render() {   
        return (   
            <div>
                <h1>Admin</h1>
            </div>
        );
    }
}

export default AdminLayout

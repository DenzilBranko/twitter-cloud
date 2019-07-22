import React,{ Component } from 'react'
import { Icon } from 'react-icons-kit'
import { bell } from 'react-icons-kit/ikons/bell'
import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'
import { getTweets,loadAllUnreadTweets } from '../actions/actions'

import {StockUpdate}  from '../StockUpdate'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyword: "",
            unread_count: ""
        }
    }
    
    handleSearchChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClick = (e) => {
        e.preventDefault()
        this.props.getTweets(this.state.keyword)
        StockUpdate((err, message) => {
           this.setState({
               unread_count: message[0].total_count
           })
        })
    }

    loadAll = (e) => {
        e.preventDefault()
        this.props.loadAllUnreadTweets()
    }

    render() {
        return(
            <div>
                <div className="topnav">
                    <div className="searchBox">
                        <input type="text" className="searchText" name="keyword" value={this.state.keyword} onChange={e=>this.handleSearchChange(e)}/>
                        <button onClick={e=>this.handleClick(e)}>Search</button>
                        <div className="unread-tweet">
                            <Icon size={25} icon={bell}/>{this.state.unread_count}
                        </div>
                        <button className="load" style={{marginLeft: "50px"}} onClick={e=>this.loadAll(e)}>Load</button>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getTweets,loadAllUnreadTweets},dispatch)
}

export default connect(null,mapDispatchToProps) (Search);
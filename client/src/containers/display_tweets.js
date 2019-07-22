import React,{ Component } from 'react'
import {connect} from 'react-redux'
import{Link} from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { getTweets,loadAllUnreadTweets,updateReadTweets } from '../actions/actions'
class ListOfTweets extends Component {

    changeReadStatus = async(e,id,name) => {
        e.preventDefault()
        this.props.updateReadTweets(id,name)
        
    }
    tweetList = ({list}) => {
        
        if(list) {
            return list.map((item) => {
                if(item.read_status) {
                    return (
                        
                            <Link  className="list-display" key={item.id} onClick={e=>this.changeReadStatus(e,item.id,item.name)}>
                                <div>
                                    <h5>{item.name}</h5><br/>
                                    <label>{item.description}</label>
                                </div>
                            </Link>
                       
                    )
                } else {
                    return (
                        <div>
                            <div>
                                <h5>{item.name}</h5><br/>
                                <label>{item.description}</label>
                            </div>
                        </div>
                    ) 
                }
            })
        }

    }
    render() {
        return(
            <div >
                {this.tweetList(this.props.search)}
            </div>
        ) 
    }
}

function mapStateToProps(state) {
  
    return {
        search: state.search
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({getTweets,loadAllUnreadTweets,updateReadTweets},dispatch)
}




export default connect(mapStateToProps,mapDispatchToProps)(ListOfTweets)
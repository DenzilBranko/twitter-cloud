import React,{ Component } from 'react'

import Search from '../containers/search'
import ListOfTweets from '../containers/display_tweets'


class App extends Component {

    
    render() {
        return(
            <div>
               <Search/>
               <ListOfTweets/>
            </div>
        )
    }
}

export default App;
import { combineReducers } from 'redux'
import search from './search_reducers'


const rootReducers = combineReducers({
    search,
})

export default rootReducers;
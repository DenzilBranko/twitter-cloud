
export default function(state={},action) {
    switch(action.type) {
        case 'SEARCH_TWEET':
            return {...state,list:action.payload}
        default:
            return state
    }
}
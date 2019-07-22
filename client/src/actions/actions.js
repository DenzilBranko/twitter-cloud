import Axios from "axios";

const ROOT_URL = 'http://localhost:5000'

export function getTweets(keywords) {
    return async(dispatch) => {
       const result = await Axios.get(`${ROOT_URL}/api/get-twitter-api?q=${keywords}`)
     
        dispatch({
            type: 'SEARCH_TWEET',
            payload: result.data.result
        })
    }
    
}

export function loadAllUnreadTweets(keywords) {
    return async(dispatch) => {
       const result = await Axios.get(`${ROOT_URL}/api/get-all-tweets`)
        dispatch({
            type: 'SEARCH_TWEET',
            payload: result.data
        })
    }
    
}

export function updateReadTweets(id,name) {
   
    let data = {
        id: id,
        name: name
    }
    return async(dispatch) => {
       const result = await Axios.put(`${ROOT_URL}/api/update-read-tweets?q=${id}&q=${name}`)
        dispatch({
            type: 'SEARCH_TWEET',
            payload: result.data
        })
    }
    
}
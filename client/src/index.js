import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter,Route } from 'react-router-dom'
import {Provider} from 'react-redux'
import{ createStore,applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk';
import reducers from './reducers'
import App from './components/App'
import './static/style.css';


const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
 //const store = createStoreWithMiddleware(reducers);

ReactDom.render(
    <Provider store={ createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div>
                <Route exact path="/" component={App}></Route>
                {/* <Route path="/read/:id" component={Car}></Route> */}
            </div>
        </BrowserRouter>
    </Provider>
    
    ,document.querySelector('#root'));
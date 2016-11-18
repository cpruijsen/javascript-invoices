import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom';
import Customers from './components/Customers'
import Products from './components/Products'
import Invoices from './components/Invoices'
import NoMatch from './components/NoMatch'

import {Router, Route, IndexRoute, hashHistory} from 'react-router'

const Routes = (props) => (
	<Router {...props}>
		<Route path='/' component={Invoices}/>
		<Route path='customers' component={Customers}/>
		<Route path='products' component={Products}/>
		<Route path="*" component={NoMatch}/>
	</Router>
);

ReactDOM.render(
  <Routes history={hashHistory}/>,
  document.getElementById('root')
);

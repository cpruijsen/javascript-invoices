import React, {Component} from 'react';

import CreateCustomer from './createCustomer';

export default class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: null,
      formattedCustomers: null,
      showCreateCustomer: false
    };
    this.showCreateCustomers = this.showCreateCustomers.bind(this);
  }
  componentDidMount() {
    let that = this;
    fetch('http://localhost:8000/api/customers')
      .then(res => res.json())
      .then(customers => {
        console.log('customers fetched', customers);
        // I noticed the customer data had a lot of duplicates, so we'll de-dupe it here for deep equal on the three customer props.
        let customerObj = {};
        customers.forEach(customer => {
          customerObj[`${customer.name}, ${customer.address}, ${customer.phone}`] = customer;
        });
        let customerSet = [];
        for (let key in customerObj) {
          if (customerObj.hasOwnProperty(key)) {
            customerSet.push(customerObj[key]);
          }
        }
        that.setState({customers: customers});
        let formattedCustomers = customerSet.map(customer => {
          return <tr key={`customer_${customer.id}`}>
            <td>{customer.id}</td>
            <td>{customer.name}</td>
            <td>{customer.address}</td>
            <td>{customer.phone}</td>
          </tr>
        });
        that.setState({formattedCustomers: formattedCustomers});
      }).catch(err => console.warn('err customers fetch', err));
  }
  render() {
    let that = this;
    /* customers:
    - id (integer)
    - name (string)
    - address (string)
    - phone (string)
    */
    return (
      <div>
        {!this.state.showCreateCustomer ? <div>
          <table className="table">
      				<thead>
      				<tr>
                <th>Id</th>
      					<th>Name</th>
      					<th>Address</th>
                <th>Phone</th>
      				</tr>
      				</thead>
      				<tbody>
      				{this.state.formattedCustomers}
      				</tbody>
      			</table>
          <button onClick={() => that.showCreateCustomers()}>create new customer</button>
        </div> : <CreateCustomer returnToCustomers={this.showCreateCustomers}/>}
      </div>
    );
  }
  showCreateCustomers() {
    this.setState({
      showCreateCustomer: !this.state.showCreateCustomer
    });
  }
}

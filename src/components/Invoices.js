import React, {Component} from 'react';
import CreateInvoice from './createInvoice';

export default class Invoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: null,
      formattedInvoices: null,
      showCreateInvoice: false
    };
    this.showCreateInvoice = this.showCreateInvoice.bind(this);
    this.getCustomers = this.getCustomers.bind(this);
    this.getProducts = this.getProducts.bind(this);
  }
  componentDidMount() {
    let that = this;
    fetch('http://localhost:8000/api/invoices')
      .then(res => res.json())
      .then(invoices => {
        console.log('invoices fetched', invoices);
        that.setState({invoices: invoices});
        let formattedInvoices = invoices.map(invoice => {
          return <tr key={`invoice_${invoice.id}`}>
            <td>{invoice.id}</td>
            <td>{invoice.customer_id}</td>
            <td>{invoice.total}</td>
            <td>{invoice.discount}</td>
            <td>{invoice.createdAt}</td>
          </tr>
        });
        that.setState({formattedInvoices: formattedInvoices});
      }).catch(err => console.warn('err invoices fetch', err));
  }
  render() {
    let that = this;
    /* invoices:
    - id (integer)
    - customer_id (integer)
    - discount (decimal)
    - total (decimal)

    -- can add items <th>Invoice items</th>
    -- will have to do an additional fetch.
    -- can also fetch client info etc. maybe render past invoices?
    */

    return (
      <div>
        {!this.state.showCreateInvoice ? <div>
          <table className="table">
      				<thead>
      				<tr>
                <th>Id</th>
      					<th>Client</th>
      					<th>Invoice sum $</th>
                <th>Discount %</th>
      					<th>Created</th>
      				</tr>
      				</thead>
      				<tbody>
      				{this.state.formattedInvoices}
      				</tbody>
      			</table>
          <button onClick={() => that.showCreateInvoice()}>create new invoice</button>
        </div> : <CreateInvoice customers={this.getCustomers()} products={this.getProducts()} returnToInvoices={this.showCreateInvoice}/>}
      </div>
    );
  }
  showCreateInvoice() {
    this.setState({
      showCreateInvoice: !this.state.showCreateInvoice
    });
  }
  getCustomers() {
    fetch('http://localhost:8000/api/customers')
      .then(res => res.json())
      .then(customers => {
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
        let formattedCustomers = customerSet.map(customer => {
          return <tr key={`customer_${customer.id}`}>
            <td>{customer.id}</td>
            <td>{customer.name}</td>
            <td>{customer.address}</td>
            <td>{customer.phone}</td>
          </tr>
        });
        return formattedCustomers;
      }).catch(err => console.warn('err fetching customers', err));
  }
  getProducts() {
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(products => {
        // I noticed the product data had a lot of duplicates, so we'll de-dupe it here for deep equal on the two product props.
        let productObj = {};
        products.forEach(product => {
          productObj[`${product.name}, ${product.price}`] = product;
        });
        let productSet = [];
        for (let key in productObj) {
          if (productObj.hasOwnProperty(key)) {
            productSet.push(productObj[key]);
          }
        }
        let formattedProducts = productSet.map(product => {
          return <tr key={`product_${product.id}`}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.price}</td>
          </tr>
        });
        return formattedProducts;
      }).catch(err => console.warn('err fetching products', err));
  }
}

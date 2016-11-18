import React, {Component} from 'react';
import Select2 from 'react-select2-wrapper';
import uuid from 'uuid-v4';

export default class CreateInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addedProductIds: [],
      addedProductQuantities: [],
      customer: null,
      discount: 0,
      total: 0,
      invoiceId: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
    this.formatCustomersForSelect = this.formatCustomersForSelect.bind(this);
    this.formatProductsForSelect = this.formatProductsForSelect.bind(this);
  }
  render() {
    let that = this;
    return (
      <div>
        <p>New Invoice Form</p>

      {/* only enable user to select customer once per invoice */}
        {!this.state.invoiceId ? <div>

          <p> select customer to create the invoice </p>
          <Select2
            ref="customerSelector"
            data={this.formatCustomersForSelect()}
            options={{
											 placeholder: 'search customer',
										 }}
            onSelect={() => this.onCustomerSelect()}
          />
      </div> : <p>Customer: {this.state.customer}, Invoice: {this.state.invoiceId} - re-render to create a new invoice</p>}

      {/* only enable user to select products once customer is selected */}
      {this.state.invoiceId ? <div>
        <p> add products </p>
        <Select2
          multiple
          ref="productSelector"
          data={this.formatProductsForSelect()}
          options={{
                     placeholder: 'search product',
                   }}
          onSelect={() => this.onProductSelect()}
        />
      </div> : null}

      {/* only enable user to select product quantities once products are selected */}
      {this.state.addedProductIds.length > 0 ? <div>
        <p> select product quantities </p>
        {this.state.addedProductIds.map(productId => {
          let product = this.props.products.filter(product => {
            return product.id === productId;
          });
          product = product[0];
          return <form key={uuid()}>
            <p>set quantity for {product.name}</p>
            <input name={`${product.id}, ${product.price}`} type="number" onChange={this.handleQuantitySet}/>
          </form>
        })}

      </div> : null}

        <div>
          <p> set discount % </p>
          <form>
            <input type="number" onChange={this.handleChange} name="discount" min={0} max={100}/>
          </form>
        </div>

        <div>
          <p>total: {this.state.total}</p>
        </div>

        <button onClick={() => that.props.returnToInvoices()}>return to invoices</button>
      </div>
    );
  }
  formatCustomersForSelect() {
    return this.props.customers.map(customer => {
      return {
        id: customer.id,
        text: customer.name
      };
    });
  }
  formatProductsForSelect() {
    return this.props.products.map(product => {
      return {
        id: product.id,
        text: `${product.name} + ${product.price}`
      };
    });
  }
  onProductSelect() {
    let productId = parseInt(this.refs.productSelector.el.val());
    let products = this.state.addedProductIds.slice();
    // add once - to a list.
    if (products.indexOf(productId) > 0) {
      return;
    } else {
      products.push(productId);
    }
    this.setState({addedProductIds: products});
    console.log('product', productId);
  }
  onCustomerSelect() {
    let that = this;
    let customerId = parseInt(this.refs.customerSelector.el.val());
    this.setState({customer: customerId});
    // create the invoice in first instance when we have the customer
    let body = {
      customer_id: this.state.customer,
      discount: this.state.discount,
      total: this.state.total
    };
    fetch('http://localhost:8000/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
      .then(invoice => {
        console.log('invoice created', invoice);
        that.setState({invoiceId: invoice.id});
    }).catch(err => console.warn('error posting invoice', err));
  }
  handleChange(e) {
    let that = this;
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      that.calculateTotal();
    });
  }
  handleQuantitySet(e) {
    let that = this;
    console.log('name', e.target.name, 'val', e.target.value);
    // e.target.name is 'productId, productPrice'
    // split on ',' then handle
    // e.target.value is the quantity


    // flow into calculateTotal, then saveInvoice

    /*
    ## InvoiceItems
    - id (integer)
    - invoice_id (integer)
    - product_id (integer)
    - quantity (decimal)
    */
    /*
    ## Invoices
    ```
    GET|POST          /api/invoices
    GET|PUT|DELETE    /api/invoices/{id}
    ```

    ## InvoiceItems
    ```
    GET|POST          /api/invoices/{id}/items
    GET|PUT|DELETE    /api/invoices/{invoice_id}/items/{id}
    ```
    */

  }
  calculateTotal() {
    let productTotal = 0;
    // this.state.products.forEach(product => {
    //   productTotal += product.price;
    // });
    // let total = productTotal * (1 - this.state.discount);
    // this.setState({total: total});
  }
  saveInvoice() {
    // save the invoice to the DB on every change.

    /*
    ## Invoices
    - id (integer)
    - customer_id (integer)
    - discount (decimal)
    - total (decimal)
    */

  }
}

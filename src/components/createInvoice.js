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
      invoiceId: null,
      newProductPrice: null,
      newProduct: null,
      productError: false,
      newCustomer: null,
      newCustomerPhone: null,
      newCustomerAddress: null,
      customerError: false,
      customerCreateMessage: null,
      productCreateMessage: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleQuantitySet = this.handleQuantitySet.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
    this.formatCustomersForSelect = this.formatCustomersForSelect.bind(this);
    this.formatProductsForSelect = this.formatProductsForSelect.bind(this);
    this.submitProduct = this.submitProduct.bind(this);
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
            <input name={`${product.id},${product.price}`} type="number" onChange={this.handleQuantitySet}/>
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

      <div>
        <form>
          <p> create new product </p>
          <input type="text" name="newProduct" onChange={this.handleChange}/>
          { this.state.productError ? <p>product already exists</p> : null }
          <p> new product price </p>
          <input type="number" onChange={this.handleChange} name="newProductPrice" min={0} max={100}/>
          {this.state.newProduct && this.state.newProductPrice ? <button onClick={() => that.submitProduct()}> submit new product </button> : null}
        </form>

        <form>
          <p> create new customer </p>
          <input type="text" name="newCustomer" onChange={this.handleChange}/>
          { this.state.customerError ? <p>customer already exists</p> : null }
          <p> new customer address </p>
          <input type="text" onChange={this.handleChange} name="newCustomerAddress" />
          <p> new customer phone </p>
          <input type="text" onChange={this.handleChange} name="newCustomerPhone" />
          {this.state.newCustomer ? <button onClick={() => that.submitCustomer()}> submit new customer </button> : null}
        </form>

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
    let persistedEvent = e.target;
    this.setState({
      [persistedEvent.name]: persistedEvent.value
    }, () => {
      if (persistedEvent.name === 'discount') {
        that.calculateTotal();
      }
    });
  }
  submitProduct() {
    let that = this;
    let productError;
    let body = {
      price: this.state.newProductPrice,
      name: this.state.newProduct
    };
    // check if product exists
    this.props.products.forEach(product => {
      if (product.name === that.state.newProduct) {
        productError = true;
      }
    });
    // if exists, show error message, if not, create
    if (productError) {
      this.setState({productError: true});
    } else {
      fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(res => res.json())
        .then(product => {
          console.log('success create product', product);
          that.setState({productCreateMessage: `success create product: ${body.name}, price: ${body.price}`})
        }).catch(err => console.warn('error creating product', err));
    }
  }
  submitCustomer() {
    let that = this;
    let customerError;
    let body = {
      name: this.state.newCustomer,
      address: this.state.newCustomerAddress || 'n/a',
      phone: this.state.newCustomerPhone || 'n/a'
    };
    // check if product exists
    this.props.customer.forEach(customer => {
      if (customer.name === that.state.newCustomer) {
        customerError = true;
      }
    });
    // if exists, show error message, if not, create
    if (customerError) {
      this.setState({customerError: true});
    } else {
      fetch('http://localhost:8000/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(res => res.json())
        .then(customer => {
          console.log('success create customer', customer);
          that.setState({customerCreateMessage: `success create customer: ${body.name}`})
        }).catch(err => console.warn('error creating customer', err));
    }
  }
  handleQuantitySet(e) {
    let that = this;
    let persistedEvent = e.target;
    let product = persistedEvent.name.split(',');

    let addedQuantity = {
      id: product[0],
      price: product[1],
      quantity: persistedEvent.value
    };
    console.log('new product quantity', addedQuantity);

    let addedProductQuantities = this.state.addedProductQuantities.slice();
    if (addedProductQuantities.length === 0) {
      addedProductQuantities.push(addedQuantity);
    } else {
      addedProductQuantities.map(addedProduct => {
        if (addedProduct.id === addedQuantity.id) {
          return addedQuantity;
        } else {
          return addedProduct;
        }
      });
    }
    this.setState({addedProductQuantities: addedProductQuantities}, () => {
      // calculate the total, then update the invoice etc.
      that.calculateTotal();
    });

    // post the invoice_item to the DB.
    let body = {
      product_id: product[0],
      quantity: persistedEvent.value
    };
    let url = `http://localhost:8000/api/invoices/${this.state.invoiceId}/items`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
      .then(invoice_item => console.log('item created', invoice_item))
      .catch(err => console.warn('error creating invoice_item', err));
  }
  calculateTotal() {
    let that = this;
    let productTotal = 0;
    this.state.addedProductQuantities.forEach(product => {
      productTotal += (product.price * product.quantity);
    });
    let total = productTotal * (100 - this.state.discount);
    this.setState({total: total}, () => {
      let body = {
        customer_id: that.state.customer,
        discount: that.state.discount,
        total: total
      };
      fetch(`/api/invoices/${that.state.invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(res => res.json())
        .then(invoice => console.log('success update invoice', invoice))
        .catch(err => console.warn('error updating invoice', err));
    });
  }
}

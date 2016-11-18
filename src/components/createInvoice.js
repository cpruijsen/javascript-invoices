import React, {Component} from 'react';
import Select2 from 'react-select2-wrapper';

export default class CreateInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      customer: null,
      discount: 0,
      total: 0
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
        <div>
          <p> select customer </p>
          <Select2
            multiple
            data={this.formatCustomersForSelect()}
          />
        </div>

        <div>
          <p> add products </p>
          <Select2
            multiple
            data={this.formatCustomersForSelect()}
          />
        </div>

        <div>
          <p> set discount % </p>
          <form>
            <input type="number" onChange={this.handleChange} name="discount"/>
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
    this.props.customers.map(customer => {
      return {
        id: customer.id,
        text: customer.name
      };
    });
  }
  formatProductsForSelect() {
    this.props.products.map(product => {
      return {
        id: product.id,
        text: `${product.name} + ${product.price}`
      };
    });
  }
  handleChange(e) {
    let that = this;
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      that.calculateTotal();
    });
  }
  calculateTotal() {
    let productTotal = 0;
    this.state.products.forEach(product => {
      productTotal += product.price;
    });
    let total = productTotal * (1 - this.state.discount);
    this.setState({total: total});
  }
}

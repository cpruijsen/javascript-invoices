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
        </div> : <CreateInvoice returnToInvoices={this.showCreateInvoice}/>}
      </div>
    );
  }
  showCreateInvoice() {
    this.setState({
      showCreateInvoice: !this.state.showCreateInvoice
    });
  }
}

import React, {Component} from 'react';
import CreateInvoice from './createInvoice';

export default class Invoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: null,
      invoiceTable: null,
      showCreateInvoice: false
    };
    this.showCreateInvoice = this.showCreateInvoice.bind(this);
    this.renderInvoiceTable = this.renderInvoiceTable.bind(this);
  }
  componentDidMount() {
    let that = this;
    fetch('http://localhost:8000/api/invoices')
      .then(res => res.json())
      .then(invoices => {
        console.log('invoices fetched', invoices);
        that.setState({invoices: invoices});
        that.renderInvoiceTable(invoices);
      }).catch(err => console.warn('err invoices fetch', err));
  }
  render() {
    let that = this;
    return (
      <div>
        {!this.state.showCreateInvoice ? <div>
          {this.state.invoiceTable ? this.state.invoiceTable : <p> Loading...</p>}
          <button onClick={() => that.showCreateInvoice()}>create new invoice</button>
        </div> : <CreateInvoice returnToInvoices={this.showCreateInvoice}/>}
      </div>
    );
  }
  renderInvoiceTable(invoices) {
    /* invoices:
    - id (integer)
    - customer_id (integer)
    - discount (decimal)
    - total (decimal)

    -- can add items <th>Invoice items</th>
    -- will have to do an additional fetch.
    -- can also fetch client info etc. maybe render past invoices?
    */

    let formattedInvoices = invoices.map(invoice => {
      <tr key={`invoice_${invoice.id}`}>
        <td>{invoice.id}</td>
        <td>{invoice.customer_id}</td>
        <td>{invoice.total}</td>
        <td>{invoice.discount}</td>
        <td>{invoice.createdAt}</td>
      </tr>
    });

    let invoiceTable = <table className="table">
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
				{formattedInvoices}
				</tbody>
			</table>

    this.setState({invoiceTable: invoiceTable});
  }
  showCreateInvoice() {
    this.setState({
      showCreateInvoice: !this.state.showCreateInvoice
    });
  }
}

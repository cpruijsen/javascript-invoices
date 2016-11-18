import React, {Component} from 'react';

export default class CreateInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    let that = this;
    return (
      <div>
        <p>createinvoice</p>

        <button onClick={() => that.props.returnToInvoices()}>return to invoices</button>
      </div>
    );
  }
}

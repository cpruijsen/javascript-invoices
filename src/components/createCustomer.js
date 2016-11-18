import React, {Component} from 'react';

export default class CreateCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    let that = this;
    return (
      <div>
        <p>createCustomer</p>
        <button onClick={() => that.props.returnToCustomers()}>return to customers</button>
      </div>
    );
  }
}

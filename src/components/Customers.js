import React, {Component} from 'react'

export default class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: null
    };
  }
  componentDidMount() {
    let that = this;
    fetch('http://localhost:8000/api/customers')
      .then(res => res.json())
      .then(customers => {
        console.log('customers fetched', customers);
        that.setState({customers: customers});
      }).catch(err => console.warn('err customers fetch', err));
  }
  render() {
    return (
      <div>
        <p>customers</p>
      </div>
    );
  }
}

import React, {Component} from 'react'

export default class Invoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: null
    };
  }
  componentDidMount() {
    let that = this;
    fetch('http://localhost:8000/api/invoices')
      .then(res => res.json())
      .then(invoices => {
        console.log('invoices fetched', invoices);
        that.setState({invoices: invoices});
      }).catch(err => console.warn('err invoices fetch', err));
  }
  render() {
    return (
      <div>
        <p>invoices</p>
      </div>
    );
  }
}

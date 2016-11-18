import React, {Component} from 'react'

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null
    };
  }
  componentDidMount() {
    let that = this;
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(products => {
        console.log('products fetched', products);
        that.setState({products: products});
      }).catch(err => console.warn('err products fetch', err));
  }
  render() {
    return (
      <div>
        <p>products</p>
      </div>
    );
  }
}

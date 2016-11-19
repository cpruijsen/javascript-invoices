import React, {Component} from 'react';

import CreateProduct from './createProduct';

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      formattedProducts: null,
      showCreateProduct: false
    };
    this.showCreateProducts = this.showCreateProducts.bind(this);
  }
  componentDidMount() {
    let that = this;
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(products => {
        console.log('products fetched', products);
        // I noticed the product data had a lot of duplicates, so we'll de-dupe it here for deep equal on the two product props.
        let productObj = {};
        products.forEach(product => {
          productObj[`${product.name}, ${product.price}`] = product;
        });
        let productSet = [];
        for (let key in productObj) {
          if (productObj.hasOwnProperty(key)) {
            productSet.push(productObj[key]);
          }
        }
        that.setState({products: productSet});
        let formattedProducts = productSet.map(product => {
          return <tr key={`product_${product.id}`}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.price}</td>
          </tr>
        });
        that.setState({formattedProducts: formattedProducts});
      }).catch(err => console.warn('err products fetch', err));
  }
  render() {
    let that = this;
    return (
      <div>
        {!this.state.showCreateProduct ? <div>
          <table className="table">
      				<thead>
      				<tr>
                <th>Id</th>
      					<th>Name</th>
      					<th>Price</th>
      				</tr>
      				</thead>
      				<tbody>
      				{this.state.formattedProducts}
      				</tbody>
      			</table>
          <button onClick={() => that.showCreateProducts()}>create new product</button>
        </div> : <CreateProduct returnToProducts={this.showCreateProducts}/>}
      </div>
    );
  }
  showCreateProducts() {
    this.setState({
      showCreateProduct: !this.state.showCreateProduct
    });
  }
}

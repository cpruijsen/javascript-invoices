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
        that.setState({products: products});
        let formattedProducts = products.map(product => {
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
    /* products:
    - id (integer)
    - name (string)
    - price (decimal)
    */
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

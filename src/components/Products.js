import React, {Component} from 'react';

import CreateProduct from './createProduct';


export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      productsTable: null,
      showCreateProduct: false
    };
    this.renderProductTable = this.renderProductTable.bind(this);
    this.showCreateProducts = this.showCreateProducts.bind(this);
  }
  componentDidMount() {
    let that = this;
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(products => {
        console.log('products fetched', products);
        that.setState({products: products});
        that.renderProductTable(products);
      }).catch(err => console.warn('err products fetch', err));
  }
  render() {
    return (
      <div>
        {!this.state.showCreateProduct ? <div>
          {this.state.productsTable ? this.state.productsTable : <p> Loading...</p>}
          <button onClick={() => that.showCreateProducts()}>create new product</button>
        </div> : <CreateProduct returnToProducts={this.showCreateProducts}/>}
      </div>
    );
  }
  renderProductTable(products) {
    /* products: 
    - id (integer)
    - name (string)
    - price (decimal)
    */
    let formattedProducts = products.map(product => {
      <tr key={`invoice_${invoice.id}`}>
        <td>{product.id}</td>
        <td>{product.name}</td>
        <td>{product.price}</td>
      </tr>
    });

    let productsTable = <table className="table">
				<thead>
				<tr>
          <th>Id</th>
					<th>Name</th>
					<th>Price</th>
				</tr>
				</thead>

				<tbody>
				{formattedProducts}
				</tbody>
			</table>

    this.setState({productsTable: productsTable});
  }
  showCreateProducts() {
    this.setState({
      showCreateProduct: !this.state.showCreateProduct
    });
  }
}

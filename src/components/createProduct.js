import React, {Component} from 'react';

export default class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    let that = this;
    return (
      <div>
        <p>createproduct</p>
        <button onClick={() => that.props.returnToProducts()}>return to products</button>
      </div>
    );
  }
}

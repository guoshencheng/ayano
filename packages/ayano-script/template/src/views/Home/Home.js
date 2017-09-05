import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Home.scss';

class Home extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div id="home-page">
        <h1>welcome to Ayano app!</h1>
        <h4>
          Try to replace home page code at:
          <pre>src/views/Home/Home.js</pre>
        </h4>
      </div>
    )
  }
}

export default Home;

import { Component } from 'react';
import { connectApp } from 'ayano-react';
import './Home.scss';

class Home extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.repo.fetchRepo();
  }

  render() {
    const { repo = {} } = this.props.repo;
    const { owner = {}, html_url } = repo;
    const { url, login } = owner;
    return (
      <div id="home-page">
        <h1>welcome to ayano app!</h1>
        <h4>
          Try to replace home page code at:
          <pre>src/views/Home/Home.js</pre>
        </h4>
        <h4>
          <pre>
            owner: { login }
          </pre>
          <pre>
            Repo url: { html_url }
          </pre>
          <pre>
            owner url: { url }
          </pre>
        </h4>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    repo: state.repo
  }
}

export default connectApp(mapStateToProps)(Home);

import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'underscore';

const withCurrentUser = (Component) => {
  const HOC = class extends React.Component {
    state = {
      currentUser: null
    }

    componentWillUnmount() {
      this.setState({
        currentUser: null
      })
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if (!isEmpty(nextProps.currentUser)) {
        this.setState({
          currentUser: nextProps.currentUser
        })
      }
    }

    componentDidMount() {
      this.setState({
        currentUser: this.props.currentUser
      })
    }

    render() {
      const { currentUser, ...other_props} = this.props
      return this.state.currentUser ?
            <Component currentUser={this.state.currentUser} {...other_props}/> :
            null
    }
  }

  return connect(
    mapState,
    null
  )(HOC)
};

const mapState = state => {
  const { data = null } = state.user;
  return { currentUser: data };
};

export default withCurrentUser;

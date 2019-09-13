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
        currentUser: null,
        currentUserRoleName: null
      })
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if (!isEmpty(nextProps.currentUser)) {
        this.setState({
          currentUser: nextProps.currentUser,
          currentUserRoleName: nextProps.currentUser.role.name
        })
      }
    }

    componentDidMount() {
      this.setState({
        currentUser: this.props.currentUser,
        currentUserRoleName: this.props.currentUser ? this.props.currentUser.role.name : null
      })
    }

    render() {
      const { currentUser, currentUserRoleName, ...other_props} = this.props
      return this.state.currentUser ?
            <Component {...this.state} {...other_props}/> :
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

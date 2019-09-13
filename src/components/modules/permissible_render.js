import { Component } from 'react';
import PropTypes from 'prop-types';
import { intersection, difference } from 'lodash';

class PermissibleRender extends Component {
  static propTypes = {
    oneperm: PropTypes.bool,
    userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    requiredPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.element.isRequired,
    renderOtherwise: PropTypes.element,
  };

  checkPermissions() {
    const { userPermissions, requiredPermissions, oneperm } = this.props;

    if (oneperm) {
      return intersection(userPermissions, requiredPermissions).length;
    }

    return difference(requiredPermissions, userPermissions).length === 0;
  }

  render() {
    const { children, userPermissions, requiredPermissions, renderOtherwise } = this.props;

    if (!children || !userPermissions || !requiredPermissions) {
      return null;
    }

    if (this.checkPermissions()) {
      return children;
    } else if (renderOtherwise) {
      return renderOtherwise;
    }
    return null;
  }
}

export default PermissibleRender
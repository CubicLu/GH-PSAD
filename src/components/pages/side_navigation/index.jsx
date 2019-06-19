import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";

class SideNavigation extends React.Component {
  render() {
    const { match } = this.props;

    return (
      <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
        <Link to={`${match.path}/cameras`}/>
      </div>
    );
  }
}

export default connect()(SideNavigation);

import React from "react";

class Layout extends React.Component {
  render() {
    return (
      <div className="container-fluid pt-1">
        {this.props.children}
      </div>
    );
  }
}


export default Layout;

import React from 'react';
/*
 This HOC component was initially developed to prevent errors/warnings/memory leaks in case
 when component gets unmounted before ajax request that was started on `componentDidMount`
 cannot be finished before `componentWillUnmount`
 ==========================================================================================
 Examples of usage:
 1. fetchingComponent(Component, fetchData)
 2. connect()(fetchingComponent(Component, fetchData))
 3. withRouter(fetchingComponent(Component, fetchData))
 ==========================================================================================
 NOTE: `fetchData` will be always called in WrapperComponent's context, so, feel free to use
 `props`, `state` or whatever else related to WrapperComponent's context
 */
const withFetching = (Component, fetchData) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isFetching: true
      };
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    fetchFinished = () => {
      if (this._isMounted) {
        this.setState({ isFetching: false })
      }
    };

    componentDidMount() {
      this._isMounted = true;
      fetchData(this);
    }

    fetchStarted = () => {
      this.setState({ isFetching: true });
    };

    render() {
      return <Component
        isFetching={this.state.isFetching}
        fetchStarted={this.fetchStarted}
        fetchFinished={this.fetchFinished}
        {...this.props} />
    }
  }
};

export default withFetching;

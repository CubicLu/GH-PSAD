const resourceFetcher = fetcher => {
  return (wrapper, fetchCondition, onResponse) => {
    if (!fetchCondition) {
      wrapper.fetchFinished();
      return;
    }

    const { params } = wrapper.props.match;

    fetcher(params)
      .then(onResponse)
      .catch(err => console.error(err))
      .finally(wrapper.fetchFinished)
  };
};

export default resourceFetcher;

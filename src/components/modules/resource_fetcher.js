const resourceFetcher = fetcher => {
  return (wrapper, fetchCondition, onResponse) => {
    if (!fetchCondition) {
      wrapper.fetchFinished();
      return;
    }

    const { params } = wrapper.props.match;
    const query = (new URL(window.location.href)).searchParams;
    const page = query.get('page')

    fetcher({...params, page})
      .then(onResponse)
      .catch(err => console.error(err))
      .finally(wrapper.fetchFinished)
  };
};

export default resourceFetcher;

import { retrieveFilters } from 'components/modules/retrieve_filters';

const resourceFetcher = (fetcher, resource) => {
  return (wrapper, fetchCondition, onResponse) => {
    if (!fetchCondition) {
      wrapper.fetchFinished();
      return;
    }

    const { params } = wrapper.props.match;
    const queryURL = (new URL(window.location.href)).searchParams;
    const page = queryURL.get('page')
    let filters = retrieveFilters(resource)

    fetcher({filters, page, ...params})
      .then(onResponse)
      .catch(err => console.error(err))
      .finally(wrapper.fetchFinished)
  };
};

export default resourceFetcher;

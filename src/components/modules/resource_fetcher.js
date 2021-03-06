import { retrieveFilters } from 'components/modules/retrieve_filters';

const resourceFetcher = (fetcher, resource) => {
  return (wrapper, shouldFetch, onResponse) => {
    if (!shouldFetch) {
      wrapper.resourceFetchFinished();
      return;
    }

    const { params } = wrapper.props.match;
    const queryURL = (new URL(window.location.href)).searchParams;
    const page = queryURL.get('page')
    let filters = retrieveFilters(resource)

    wrapper.resourceFetchStarted(
      fetcher({ filters, page, ...params })
        .then(onResponse)
        .catch(err => console.error(err))
    );
  };
};

export default resourceFetcher;

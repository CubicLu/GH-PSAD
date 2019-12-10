import React from 'react';
import PropTypes from 'prop-types';
import Paggy from "react-js-pagination";
import { list as selectList } from 'selectors/list';

class Pagination extends React.Component {

  state = {
    currentPageToOpen: null
  }

  updateQueryParams = (page) => {
    this.props.history.push({
      search: `?page=${page}`
    });
  }

  open = page => {
    const { startFetching, fetcher, perPage, startFetchingPagination, stopFetchingPagination, match } = this.props;
    this.setState({
      currentPageToOpen: page
    })
    startFetchingPagination()

    startFetching(fetcher({ page, perPage, ...match.params }))
        .then((res) => this.openSucceed(res, page))
        .catch(this.openFailed)
        .finally(() => stopFetchingPagination())
    this.updateQueryParams(page);
  };

  openSucceed = (res, page) => {
    const { currentPageToOpen } = this.state
    if(currentPageToOpen === page)  {
      this.props.setList(selectList(res));
    }
  };

  openFailed = error => {
    if(error) {
      console.error(error.message);
    }
  };

  render () {
    const { total, perPage, page } = this.props;

    if (total < perPage) return null;

    return (
       <Paggy
          prevPageText='Prev'
          nextPageText='Next'
          activePage={page}
          itemsCountPerPage={perPage}
          totalItemsCount={total}
          pageRangeDisplayed={10}
          onChange={this.open}
          itemClass={"mr-1 general-text-1 page-item"}
          innerClass={'pagination justify-content-center'}
          linkClass={"page-link"}
        />
    )

  }
}

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  startFetching: PropTypes.func.isRequired,
  fetcher: PropTypes.func.isRequired,
  query: PropTypes.object,
  setList: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default Pagination;

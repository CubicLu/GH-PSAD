import React from 'react';
import PropTypes from 'prop-types';
import { times } from 'underscore';
import Paggy from "react-js-pagination";
import { Col } from 'reactstrap'
import { list as selectList } from 'selectors/list';

class Pagination extends React.Component {

  updateQueryParams = (page) => {
    this.props.history.push({
      search: `?page=${page}`
    });
  }

  open = page => {
    const { startFetching, fetcher, perPage } = this.props;
    startFetching(fetcher({ page, perPage }))
        .then(this.openSucceed)
        .catch(this.openFailed)
    this.updateQueryParams(page);
  };

  openSucceed = res => {
    this.props.setList(selectList(res));
  };

  openFailed = error => {
    console.error(error.message);
  };


  render () {
    const { total, perPage, page, list } = this.props;

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

import React from 'react';
import PropTypes from 'prop-types';
import { times } from 'underscore';
import { Pagination as Paggy, PaginationItem, PaginationLink } from 'reactstrap';
import { list as selectList } from 'selectors/list';

class Pagination extends React.Component {
  renderPages = () => {
    const { page, perPage, total } = this.props;
    const pages = [];

    times(Math.ceil(total / perPage), i => {
      const pageNumber = i + 1;

      pages.push(
        <PaginationItem active={page === pageNumber} key={i}>
          <PaginationLink onClick={() => this.open(pageNumber)}>
            {pageNumber}
          </PaginationLink>
        </PaginationItem>
      );
    });

    return pages;
  };

  updateQueryParams = (page) => {
    this.props.history.push({
      search: `?page=${page}`
    });
  }

  open = page => {
    const { fetchStarted, fetchFinished, fetcher, perPage } = this.props;
    fetchStarted();
    this.updateQueryParams(page);
    fetcher({ page, perPage })
      .then(this.openSucceed)
      .catch(this.openFailed)
      .finally(fetchFinished);
  };

  openSucceed = res => {
    this.props.setList(selectList(res));
  };

  openFailed = error => {
    console.error(error.message);
  };

  first = () => {
    return this.open(1);
  };

  prev = () => {
    const { page } = this.props;

    if (page > 1) {
      this.open(page - 1);
    }
  };

  next = () => {
    const { page, total, perPage } = this.props;
    const lastPage = Math.round(total / perPage);

    if (page < lastPage) {
      this.open(page + 1);
    }
  };

  last = () => {
    const { total, perPage } = this.props;
    const lastPage = Math.round(total / perPage);
    this.open(lastPage);
  };

  render () {
    const { total, perPage, page, list } = this.props;

    if (total < perPage) return null;
    const firstRangeElements = (perPage * page) - (perPage - 1)
    const showingCounterElements = `${firstRangeElements} - ${firstRangeElements + list.length - 1}`
    return (
      <Paggy size="md" listClassName="justify-content-center">
        <div className="mr-2 mt-1">
          Displaying {showingCounterElements} of {total}
        </div>
        <PaginationItem>
          <PaginationLink first onClick={this.first}/>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink previous onClick={this.prev}/>
        </PaginationItem>
        {this.renderPages()}
        <PaginationItem>
          <PaginationLink next onClick={this.next}/>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink last onClick={this.last}/>
        </PaginationItem>
      </Paggy>
    );
  }
}

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  fetchFinished: PropTypes.func.isRequired,
  fetchStarted: PropTypes.func.isRequired,
  fetcher: PropTypes.func.isRequired,
  query: PropTypes.object,
  setList: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default Pagination;

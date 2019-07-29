import React from 'react';
import { times } from 'underscore';
import { Pagination as Paggy, PaginationItem, PaginationLink } from 'reactstrap';
import { list as selectList } from 'selectors/list';

class Pagination extends React.Component {
  renderPages = () => {
    const { page, perPage, total } = this.props;
    const pages = [];

    times(Math.round(total / perPage), i => {
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

  open = page => {
    const { match, fetchStarted, fetchFinished, fetcher, perPage, query } = this.props;
    fetchStarted();
    fetcher({ page, perPage, ...query })
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
    const { total, perPage } = this.props;

    if (total < perPage) return null;

    return (
      <Paggy size="md" listClassName="justify-content-center">
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

export default Pagination;

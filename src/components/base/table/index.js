import React from 'react';
import { Col, Row, Table } from 'reactstrap';
import Pagination from 'components/base/pagination';
import TRSort from './tr_sort';
import ModalFilter from 'components/helpers/modals/filter';
import { isEmpty } from 'underscore';
import './table.sass'

class IndexTable extends React.Component {
  state = {
    sortedAttr: {},
    filterQuery: {},
    filterModalOpen: false
  }

  renderRecords = () => {
    const { isFetching, renderRecords } = this.props;

    if (isFetching) {
      return (<tr>
        <td>
          Loading data...
        </td>
      </tr>);
    }

    return renderRecords()
  };

  handleSortedClick = (attr) => this.setState({ sortedAttr: attr });

  handleSubmitFilter = (values) => this.setState({ filterQuery: values });

  handleSortedTableFetched = () => this.props.fetchFinished();

  toggleModal = event => this.setState((state) => ({ filterModalOpen: !state.filterModalOpen }));

  handleRefresh = () => this.setState({sortedAttr: {}})

  setQuery = (sortedAttr) => {
    const { paginationQuery } = this.props
    return !isEmpty(sortedAttr) ?
        Object.assign({}, paginationQuery , { 'order[keyword]': sortedAttr.keyword, 'order[direction]': sortedAttr.asc ? 'asc' : 'desc' })
        : paginationQuery
  }

  paginationFetcher = (pagesQuery) => this.props.filterFetcher(this.state.filterQuery, Object.assign(pagesQuery, this.setQuery(this.state.sortedAttr)))

  render() {
    const { sortedAttr, filterModalOpen } = this.state
    const { toolbar, columns } = this.props
    const toolbarWithProps = React.cloneElement(toolbar, {
      handleRefresh: this.handleRefresh,
      onClickFilter: this.toggleModal
    })
    const query = this.setQuery(sortedAttr)
    return (
      <React.Fragment>
        <ModalFilter
          isOpen={filterModalOpen}
          toggleModal={this.toggleModal}
          handleSubmitFilter={this.handleSubmitFilter}
          filterQuery={this.state.filterQuery}
          {...this.props}
        />
        <Row>
          <Col xs="12">
            {toolbarWithProps}
          </Col>
          <Col xs="12">
            <Table className="index-table">
              <thead>
                <TRSort
                  {...this.props}
                  filterQuery={this.state.filterQuery}
                  handledFetched={this.handleSortedTableFetched}
                  handleClick={this.handleSortedClick}
                  sortedAttr={sortedAttr}
                  setQuery={this.setQuery}
                >
                  {columns.props.children}
                </TRSort>
              </thead>
              <tbody>
               {this.renderRecords()}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Pagination {...this.props} query={query} fetcher={this.paginationFetcher} />
      </React.Fragment>
    );
  }
}

export default IndexTable;

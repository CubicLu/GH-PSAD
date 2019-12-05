import React from 'react';
import { Col, Row, Table } from 'reactstrap';
import { isEmpty } from 'underscore';
import { cloneDeep } from 'lodash'
import TRSort from './tr_sort';
import { list as selectList } from 'selectors/list';
import Pagination from 'components/base/pagination';
import ModalFilter from 'components/helpers/modals/filter';
import Loader from 'components/helpers/loader';
import generateBadgesFilter from 'components/modules/badges_filter/generate'
import deleteBadgesFilter from 'components/modules/badges_filter/delete'
import { retrieveFilters } from 'components/modules/retrieve_filters';
import withFetching from 'components/modules/with_fetching';

import './table.sass'

export class IndexTable extends React.Component {
  state = {
    sortedAttr: {},
    filterQuery: {},
    isActionTableFetching: false,
    isSortingFetching: false
  }

  customLoader = () => {
    return (
      <React.Fragment>
        <div className="w-100 position-absolute">
          <Loader />
        </div>
        <td height="60">
        </td>
      </React.Fragment>
    )
  }

  renderRecords = () => {
    const { isFetching, renderRecords } = this.props;
    const { isActionTableFetching } = this.state;

    if (isFetching() || isActionTableFetching) {
      return this.customLoader();
    }

    return renderRecords()
  };

  generateLocalStorageFilter = (values) => {
    const { resource } = this.props
    let queryFilter = {}
    Object.keys(values).forEach(key => {
      queryFilter[key] = values[key]
    })
    localStorage.setItem(`FILTERS_${resource}`, JSON.stringify(queryFilter));
  }

  handleSortedClick = (attr) => this.setState({ sortedAttr: attr });

  setFilterQuery = (values) => this.setState({ filterQuery: values });

  toggleModal = (event) => this.setState((state) => ({ filterModalOpen: !state.filterModalOpen }));

  startFetchingActionTable = (event) => this.setState((state) => ({ isActionTableFetching: true }));

  stopFetchingActionTable = (event) => this.setState((state) => ({ isActionTableFetching: false }));

  paginationFetcher = (pagesQuery) => this.props.filterFetcher({ filters: this.state.filterQuery, query: this.setQuery(this.state.sortedAttr), ...pagesQuery })

  badgesDelete = (badgeInfo) => {
    const { filterQuery } = this.state
    const { filterFields } = this.props
    this.submitForm(deleteBadgesFilter(filterQuery, filterFields, badgeInfo))
  }

  badgesFilter = () => {
    const { filterQuery } = this.state
    const { filterFields } = this.props
    return generateBadgesFilter(filterQuery, filterFields)
  }

  submitForm = (values, setErrorMessage) => {
    const { filterFetcher, startFetching, setList } = this.props
    const cloneValues = cloneDeep(values)
    this.setFilterQuery(cloneValues)
    this.generateLocalStorageFilter(cloneValues)

    this.startFetchingActionTable()
    startFetching(filterFetcher(Object.assign({}, { filters: cloneValues }, this.setQuery(this.state.sortedAttr))))
      .then((res) => {
        setList(selectList(res));
      })
      .catch(error => console.log(error))
      .finally(this.stopFetchingActionTable)
  }

  setQuery = (sortedAttr) => {
    const { paginationQuery } = this.props
    return !isEmpty(sortedAttr) ?
      Object.assign({}, paginationQuery, { 'order[keyword]': sortedAttr.keyword, 'order[direction]': sortedAttr.asc ? 'asc' : 'desc' })
      : paginationQuery
  }

  componentDidMount() {
    const { resource } = this.props
    this.setFilterQuery(retrieveFilters(resource))
  }

  render() {
    const { sortedAttr, filterModalOpen, filterQuery } = this.state
    const { toolbar, filterFields, columns, total: totalRecords, filterFetcher } = this.props
    let toolbarWithProps = null
    if (toolbar) {
      toolbarWithProps = React.cloneElement(toolbar, {
        fetcher: filterFetcher,
        onClickFilter: this.toggleModal,
        title: `${toolbar.props.title} (${totalRecords})`,
        filterFields,
        badgesFilter: this.badgesFilter(),
        badgesDelete: this.badgesDelete
      })
    }
    const query = this.setQuery(sortedAttr)
    return (
      <React.Fragment>
        <ModalFilter
          isOpen={filterModalOpen}
          toggleModal={this.toggleModal}
          filterQuery={filterQuery}
          submitForm={this.submitForm}
          {...this.props}
        />
        <Row>
          <Col xs="12" className="my-3 d-flex justify-content-between">
            {toolbarWithProps}
          </Col>
          <Col xs="12">
            <Table className="index-table table-responsive-md">
              <thead className="bg-dark text-white">
                <TRSort
                  {...this.props}
                  startFetchingSorting={this.startFetchingActionTable}
                  stopFetchingSorting={this.stopFetchingActionTable}
                  filterQuery={filterQuery}
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
        <Pagination
          {...this.props}
          query={query}
          stopFetchingPagination={this.stopFetchingActionTable}
          startFetchingPagination={this.startFetchingActionTable}
          fetcher={this.paginationFetcher}
        />
      </React.Fragment>
    );
  }
}

export default withFetching(IndexTable);

import React from 'react';
import { Col, Row, Table } from 'reactstrap';
import { isEmpty } from 'underscore';
import { cloneDeep } from 'lodash'
import TRSort from './tr_sort';
import { list as selectList } from 'selectors/list';
import Pagination from 'components/base/pagination';
import ModalFilter from 'components/helpers/modals/filter';
import generateBadgesFilter from 'components/modules/badges_filter/generate'
import deleteBadgesFilter from 'components/modules/badges_filter/delete'
import { retrieveFilters } from 'components/modules/retrieve_filters';
import withFetching from 'components/modules/with_fetching';

import './table.sass'

class IndexTable extends React.Component {
  state = {
    sortedAttr: {},
    filterQuery: {},
    filterModalOpen: false
  }

  renderRecords = () => {
    const { isFetching, renderRecords } = this.props;

    if (isFetching()) {
      return (<tr>
        <td>
          Loading data...
        </td>
      </tr>);
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

  paginationFetcher = (pagesQuery) => this.props.filterFetcher({filters: this.state.filterQuery, query: this.setQuery(this.state.sortedAttr), ...pagesQuery})

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


    startFetching(filterFetcher(Object.assign({}, { filters: cloneValues }, this.setQuery(this.state.sortedAttr))))
      .then((res) => {
        setList(selectList(res));
      })
      .catch(error => console.log(error))
  }

  setQuery = (sortedAttr) => {
    const { paginationQuery } = this.props
    return !isEmpty(sortedAttr) ?
        Object.assign({}, paginationQuery , { 'order[keyword]': sortedAttr.keyword, 'order[direction]': sortedAttr.asc ? 'asc' : 'desc' })
        : paginationQuery
  }

  componentDidMount() {
    const { resource } = this.props
    this.setFilterQuery(retrieveFilters(resource))
  }

  render() {
    const { sortedAttr, filterModalOpen, filterQuery } = this.state
    const { toolbar, columns, total: totalRecords, filterFetcher } = this.props
    const toolbarWithProps = React.cloneElement(toolbar, {
      fetcher: filterFetcher,
      onClickFilter: this.toggleModal,
      title: `${toolbar.props.title} (${totalRecords})`,
      badgesFilter: this.badgesFilter,
      badgesDelete: this.badgesDelete
    })
    const query = this.setQuery(sortedAttr)

    return (
      <React.Fragment>
        <ModalFilter
          isOpen={filterModalOpen}
          toggleModal={this.toggleModal}
          filterQuery={this.state.filterQuery}
          submitForm={this.submitForm}
          {...this.props}
        />
        <Row>
          <Col xs="12">
            {toolbarWithProps}
          </Col>
          <Col xs="12">
            <Table className="index-table">
              <thead className="bg-dark text-white">
                <TRSort
                  {...this.props}
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
        <Pagination {...this.props} query={query} fetcher={this.paginationFetcher} />
      </React.Fragment>
    );
  }
}

export default withFetching(IndexTable);

import React from 'react';
import { Col, Row, Table } from 'reactstrap';
import Pagination from 'components/base/pagination';
import TRSort from './tr_sort';
import ModalFilter from 'components/helpers/modals/filter';
import './table.sass'

class IndexTable extends React.Component {
  state = {
    sortedAttr: {},
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

  handleSortedClick = (attr) =>  this.setState({ sortedAttr: attr });

  handleSortedTableFetched = () => this.props.fetchFinished();

  toggleModal = event => this.setState((state) => ({ filterModalOpen: !state.filterModalOpen }));

  handleRefresh = () => this.setState({sortedAttr: {}})

  setQuery = (sortedAttr) => {
    const { paginationQuery } = this.props
    return {
      query: sortedAttr ?
        Object.assign({}, paginationQuery , { 'order[keyword]': sortedAttr.keyword, 'order[asc]': sortedAttr.asc })
        : paginationQuery
    }
  }

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
        <Pagination {...this.props} query={query}/>
      </React.Fragment>
    );
  }
}

export default IndexTable;

import React from 'react';
import { Col, Row, Table } from 'reactstrap';
import Pagination from 'components/base/pagination';
import TRSort from './tr_sort';
import './table.sass'
class IndexTable extends React.Component {
  state = {
    sortedAttr: {}
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

  handleSortedClick = (attr) => {
    this.props.fetchStarted()
    this.setState({
      sortedAttr: attr
    });
  }

  handleSortedTableFetched = () => this.props.fetchFinished();

  handleRefresh = () => {
    this.props.fetchStarted();
    this.setState({sortedAttr: {}})
  };

  setQuery = (sortedAttr) => {
    const { paginationQuery } = this.props
    return {
      query: sortedAttr ?
        Object.assign({}, paginationQuery , { 'order[keyword]': sortedAttr.keyword, 'order[asc]': sortedAttr.asc })
        : paginationQuery
    }
  }

  render() {
    const { sortedAttr } = this.state
    const { toolbar, columns, fetcher, setList } = this.props
    const toolbarWithProps = React.cloneElement(toolbar, { handleRefresh: this.handleRefresh })
    const query = this.setQuery(sortedAttr)

    return (
      <React.Fragment>
        <Row>
          <Col xs="12">
            {toolbarWithProps}
          </Col>
          <Col xs="12">
            <Table className="index-table">
              <thead>
              <TRSort
                handledFetched={this.handleSortedTableFetched}
                handleClick={this.handleSortedClick}
                setList={setList}
                fetcher={fetcher}
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
        <Pagination {...this.props} fetcher={fetcher} query={query}/>
      </React.Fragment>
    );
  }
}

export default IndexTable;

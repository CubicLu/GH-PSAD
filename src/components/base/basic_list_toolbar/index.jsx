import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, ButtonToolbar, InputGroup } from 'reactstrap';
import { list as selectList } from 'selectors/list';

class BasicListToolbar extends React.Component {
  newRecord = () => {
    const { match, history } = this.props;
    history.push(`${match.path}/new`);
  };

  refresh = () => {
    const { handleRefresh, fetchFinished, fetchStarted, fetcher } = this.props;

    fetchStarted();
    handleRefresh();
    fetcher()
      .then(this.refreshSucceed)
      .catch((error) => { console.log(error); })
      .finally(fetchFinished);
  };

  refreshSucceed = (res) => this.props.setList(selectList(res));

  render () {
    const { label, onClickFilter } = this.props;
    return (
      <React.Fragment>
        <ButtonToolbar className="pb-1 float-right">
          <ButtonGroup className="mr-1">
            <Button onClick={this.refresh}>Refresh</Button>
          </ButtonGroup>
          <InputGroup className="mr-1">
            <Button onClick={onClickFilter}>Filter</Button>
          </InputGroup>
          <ButtonGroup>
            <Button onClick={this.newRecord}>{label}</Button>
          </ButtonGroup>
        </ButtonToolbar>
      </React.Fragment>
    );
  }
}

BasicListToolbar.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  onClickFilter: PropTypes.func,
  fetchFinished: PropTypes.func.isRequired,
  fetchStarted: PropTypes.func.isRequired,
  fetcher: PropTypes.func.isRequired,
  setList: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default BasicListToolbar;

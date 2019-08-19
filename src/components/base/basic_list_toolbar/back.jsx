import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { list as selectList } from 'selectors/list';
import { Link } from 'react-router-dom';

class BasicBackListToolbar extends React.Component {
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

  refreshSucceed = (res) => {
    this.props.setList(selectList(res));
  }

  render () {
    const { label, backPath, onClickFilter } = this.props;
    return (
      <ButtonToolbar className="pb-1 float-right">
        <ButtonGroup size="lg" className="mr-1">
          <h3 className="mr-4">
            { label }
          </h3>
        </ButtonGroup>
        <ButtonGroup className="mr-1">
          <Link to={backPath} className="btn btn-primary">
            Back
          </Link>
        </ButtonGroup>
        <ButtonGroup className="mr-1">
          <Button onClick={this.refresh}>Refresh</Button>
        </ButtonGroup>
        <ButtonGroup className="mr-1">
          <Button onClick={onClickFilter}>Filter</Button>
        </ButtonGroup>
      </ButtonToolbar>
    );
  }
}

BasicBackListToolbar.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  handleRefresh: PropTypes.func,
  onClickFilter: PropTypes.func,
  fetchFinished: PropTypes.func.isRequired,
  fetchStarted: PropTypes.func.isRequired,
  fetcher: PropTypes.func.isRequired,
  setList: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  backPath: PropTypes.string.isRequired
};

export default BasicBackListToolbar;

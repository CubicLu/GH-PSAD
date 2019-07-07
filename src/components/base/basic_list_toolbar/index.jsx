import React from 'react';
import { Button, ButtonGroup, ButtonToolbar, Input, InputGroup } from 'reactstrap';
import { debounce } from 'underscore';
import { list as selectList } from 'selectors/list';

class BasicListToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };
    this.serverFilter = debounce(this.filter, 1000);
  }

  newRecord = () => {
    const { match, history } = this.props;
    history.push(`${match.path}/new`);
  };

  refresh = () => {
    const { fetchStarted, fetchFinished, fetcher } = this.props;

    fetchStarted();
    fetcher()
      .then(this.filterSucceed)
      .catch(this.filterFailed)
      .finally(fetchFinished);
  };

  filter = event => {
    const { fetchStarted, fetchFinished, fetcher } = this.props;

    fetchStarted();
    fetcher(null, null, event.target.value)
      .then(this.filterSucceed)
      .catch(this.filterFailed)
      .finally(fetchFinished);
  };

  filterSucceed = res => {
    this.props.setList(selectList(res));
  };

  filterFailed = error => {
    console.error(error.message);
  };

  onFilter = event => {
    this.setState({ filter: event.target.value });
    event.persist();
    this.serverFilter(event);
  };

  render() {
    const { label } = this.props;

    return (
      <ButtonToolbar className="pb-1 float-right">
        <ButtonGroup className="mr-1">
          <Button onClick={this.refresh}>Refresh</Button>
        </ButtonGroup>
        <InputGroup className="mr-1">
          <Input value={this.state.filter} onChange={this.onFilter}/>
        </InputGroup>
        <ButtonGroup>
          <Button onClick={this.newRecord}>{label}</Button>
        </ButtonGroup>
      </ButtonToolbar>
    );
  }
}

export default BasicListToolbar;

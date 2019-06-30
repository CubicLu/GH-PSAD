import React from 'react';
import { Button, ButtonGroup, ButtonToolbar, Input, InputGroup } from 'reactstrap';
import { debounce } from 'underscore';

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

  filter = event => {
    const { fetchStarted, fetchFinished, fetcher, page, perPage } = this.props;

    fetchStarted();
    fetcher(page, perPage, event.target.value)
      .then(this.filterSucceed)
      .catch(this.filterFailed)
      .finally(fetchFinished);
  };

  filterSucceed = res => {
    this.props.setList(res.data);
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

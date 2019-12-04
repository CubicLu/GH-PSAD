import React from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
/* Font Awesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class BasicBackListToolbarWithSearch extends React.Component {
  refresh() {
    window.location.reload(false);
  }
  newRecord = () => {
    const { history, id } = this.props;
    history.push(`${id}/new`);
  };
  render() {
    this.handleChange = e => {
      this.props.onHandleChange(e.target.value);
    };
    return (

      <ButtonToolbar className="pb-1 float-right">
        <ButtonGroup className="mr-4 search">
          <input className="form-control" type="text" onChange={this.handleChange} placeholder="Search by keyword" />
          <FontAwesomeIcon className="magnifire" color="grey" icon={faSearch} />
        </ButtonGroup>
        <ButtonGroup className="mr-4">
          <Button color="primary-lg" className="btn-md px-4 text-uppercase " onClick={this.refresh}>Refresh</Button>
        </ButtonGroup>
        <ButtonGroup className="mr-4">
          <Button color="primary-lg" className="btn-md px-4 text-uppercase " onClick={() => this.newRecord()}>+ Add Stream</Button>
        </ButtonGroup>
      </ButtonToolbar>
    );
  }
}


export default BasicBackListToolbarWithSearch;

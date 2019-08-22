import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'informed';
import { Button, InputGroup, InputGroupAddon } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

class Password extends React.Component{
  state = {
    type: 'password',
    touched: false
  }

  handleClick = () => this.setState(({type}) => ({
    type: type === 'text' ? 'password' : 'text'
  }))

  render() {
    const { field, events = {} } = this.props
    const { type } = this.state

    return (
      <InputGroup>
        <Text {...events} className="form-control" field={field.name} type={type}/>
        <InputGroupAddon onClick={this.handleClick} addonType="append">
          <Button color="secondary">
            <FontAwesomeIcon icon={type === 'text' ? faEye : faEyeSlash}/>
          </Button>
        </InputGroupAddon>
      </InputGroup>
    )
  }
}

Password.propTypes = {
  field:  PropTypes.shape({
    name: PropTypes.string.isRequired,
    filled: PropTypes.bool.isRequired
  })
}

export default Password
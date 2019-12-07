import React from 'react';
// import PropTypes from 'prop-types';
// import { Text } from 'informed';
import { FormGroup, Label, Input } from 'reactstrap';

class TextArea extends React.Component {
  state = {
    type: 'text_area',
    touched: false
  }

  handleClick = () => this.setState(({ type }) => ({
    type: type === 'text' ? 'text_area' : 'text'
  }))

  render() {
    // const { field, customAttr = {} } = this.props
    // const { type } = this.state

    return (
      <FormGroup md={6}>
        <Label for="exampleText">Text Area</Label>
        <Input type="textarea" name="text" id="exampleText" />
      </FormGroup>
    )
  }
}

// Password.propTypes = {
//   field: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     filled: PropTypes.bool.isRequired
//   })
// }

export default TextArea
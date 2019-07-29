import React from 'react';
import { Form, Text } from 'informed';
import { btnSpinner } from 'components/helpers';
import { labelFor } from 'components/helpers/forms';
import { renderForm } from 'components/base/form';

class CommonForm extends React.Component {
  render() {
    return renderForm(this.props);
  }
}

export default CommonForm;

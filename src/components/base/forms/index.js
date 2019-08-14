import React from 'react';
import { renderForm } from './common_form';
import FilterForm from './filter_form';
import ShowForm from './show_form';

const CommonForm = props => renderForm(props);

export {
  CommonForm,
  FilterForm,
  ShowForm
}

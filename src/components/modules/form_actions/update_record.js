
import { cloneDeep } from 'lodash'

function updateRecord(update, backPath, values) {
  const { id } = this.props.match.params;

  update({ id, data: cloneDeep(values) })
    .then(updateSucceed.bind(this, backPath))
    .catch(updateFailed.bind(this))
}

function updateSucceed(backPath, res) {
  const { history, setRecord, setListElement } = this.props;
  setListElement(res.data)
  setRecord(res.data);
  this.setState({ isSaving: false });
  history.push(backPath);
}

function updateFailed(error) {
  if (error.response) {
    this.setState({ errors: error.response.data.errors })
  }

  this.setState({ isSaving: false })
}

export default updateRecord;

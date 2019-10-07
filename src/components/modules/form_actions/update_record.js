
import { cloneDeep } from 'lodash'

function updateRecord(update, backPath, values) {
  const { id } = this.props.match.params;
  this.setState({ isSaving: true });

  update({ id, data: cloneDeep(values) })
    .then(updateSucceed.bind(this, backPath))
    .catch(updateFailed.bind(this))
    .finally(() => {
      this.setState({ isSaving: false });
    })
}

function updateSucceed(backPath, res) {
  const { history, setRecord, setListElement } = this.props;
  setListElement(res.data)
  setRecord(res.data);
  history.push(backPath);
}

function updateFailed(error) {
  if (error.response) {
    this.setState({ errors: error.response.data.errors })
  }
}

export default updateRecord;

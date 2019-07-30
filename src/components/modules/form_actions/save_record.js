function saveRecord(create, values) {
  this.setState({ isFetching: true });
  create({ data: JSON.parse(JSON.stringify(values)) })
    .then(createSucceed.bind(this))
    .catch(handleFailed.bind(this));
};

function createSucceed(res) {
  const { backPath, history, setRecord } = this.props;

  setRecord(res.data);
  this.setState({ isFetching: false });
  history.push(backPath);
};

function handleFailed(error) {
  if (error.response) {
    this.setState({ errors: error.response.data.errors })
  }

  this.setState({ isFetching: false });
};


export default saveRecord
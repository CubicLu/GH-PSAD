const SET_LIST = 'SET_LIST';
const SET_RECORD = 'SET_RECORD';

function setList(payload) {
  return {
    type: SET_LIST,
    payload
  }
}

function setRecord(payload) {
  return {
    type: SET_RECORD,
    payload
  }
}


export {SET_LIST, SET_RECORD, setList, setRecord};

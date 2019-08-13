const SET_LIST = 'SET_PARKING_LOT_LIST';
const SET_RECORD = 'SET_PARKING_LOT_RECORD';
const SET_VOI_LIST = 'SET_PARKING_LOT_VOI_LIST';

const setVoiList = lot_id => payload => ({
  type: SET_VOI_LIST,
  lot_id,
  payload
});

export { SET_LIST, SET_RECORD, SET_VOI_LIST, setVoiList };

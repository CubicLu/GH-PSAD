function setList(type) {
  return payload => {
    return {
      type,
      payload
    }
  }
}

function setRecord(type) {
  return payload => {
    return {
      type,
      payload
    }
  }
}

export { setList, setRecord };

import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { fromJson as showErrors } from 'components/helpers/errors';
import CommonForm from 'components/base/common_form';
import { cloneDeep } from 'lodash'
import { list as selectList } from 'selectors/list';

const Filter = function (props) {
  const {
    toggleModal,
    isOpen,
    filterFields,
    isFetching,
    filterFetcher,
    fetchStarted,
    fetchFinished,
    setList
  } = props

  const [errorMessage, setErrorMessage] = useState(null)
  const [values, setValues] = useState({})

  const submitForm = (state) => {
    const values  = cloneDeep(state.values)
    fetchStarted()
    setValues(values)
    filterFetcher(values)
    .then((res) => {
      setList(selectList(res));
      toggleModal()
    })
    .catch(error => setErrorMessage(error))
    .finally(fetchFinished)
  }

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} >
      <ModalHeader>Filter by</ModalHeader>
      <ModalBody>
        {showErrors(errorMessage)}
        <CommonForm
          {...props}
          values={values}
          fields={filterFields}
          isFetching={isFetching}
          submitForm={submitForm} />
      </ModalBody>
    </Modal>
  )
}

export default Filter;

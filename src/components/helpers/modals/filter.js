import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { fromJson as showErrors } from 'components/helpers/errors';
import { FilterForm } from 'components/base/forms';
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
    handleSubmitFilter,
    setList
  } = props

  const [errorMessage, setErrorMessage] = useState(null)
  const [values, setValues] = useState({})

  const submitForm = (values) => {
    const cloneValues  = cloneDeep(values)
    fetchStarted()
    setValues(cloneValues)
    handleSubmitFilter(cloneValues)
    filterFetcher(cloneValues)
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
        <FilterForm
          {...props}
          values={values}
          fields={filterFields}
          isFetching={isFetching}
          submitForm={submitForm}
          cancelFilter={toggleModal}/>
      </ModalBody>

    </Modal>
  )
}

export default Filter;

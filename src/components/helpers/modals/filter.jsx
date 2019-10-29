import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FilterForm } from 'components/base/forms';

const Filter = function (props) {
  const {
    toggleModal,
    isOpen,
    filterFields,
    isFetching,
    submitForm,
    filterQuery
  } = props

  const [values, setValues] = useState(null)

  useEffect(() => {
    setValues(filterQuery)
  }, [filterQuery]);

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg" >
      <ModalHeader className="justify-content-center">Filter by</ModalHeader>
      <ModalBody>
        <FilterForm
          {...props}
          values={values}
          fields={filterFields}
          isFetching={isFetching}
          submitForm={(values) => {
            submitForm(values)
            toggleModal()
          }}
          cancelFilter={toggleModal}/>
      </ModalBody>

    </Modal>
  )
}

export default Filter;

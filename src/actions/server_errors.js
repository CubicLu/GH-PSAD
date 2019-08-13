const NOT_FOUND = 'NOT_FOUND';
const INTERNAL = 'INTERNAL';

const notFound = payload => ({
  type: NOT_FOUND,
  payload
});

const internal = payload => ({
  type: INTERNAL,
  payload
});

export { notFound, internal, NOT_FOUND, INTERNAL };

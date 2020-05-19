import { FieldType } from 'components/helpers/form_fields'

const fields = [
  {
    name: 'rate',
    label: 'Hourly Rate $',
    type: FieldType.INCREASER_FIELD,
    step: 0.25,
    min: 0,
    tooltip: "Per hour rate of the parking lot",
    renderValue: value => `$${value}`
  },
  { name: 'period',
    label: 'Minimum Chargeable Time in minutes',
    type: FieldType.INCREASER_FIELD,
    step: 1800,
    max: 3600,
    min: 1800,
    tooltip: "This is the minimum time that is multiplied to the hourly rate. Ex. The driver is charged 30 minutes even if he only stayed for 20 minutes",
    renderValue: value => (value / 60)
  },
  { name: 'parked',
    label: 'Minutes before car is considered as parked',
    type: FieldType.INCREASER_FIELD,
    step: 60,
    max: 6000,
    min: 60,
    tooltip: " The car is considered as already parked if he stayed as long as what is indicated here on a parking space.",
    renderValue: value => (value / 60)
  },
  { name: 'overtime',
    label: 'Expired Parking Grace Period',
    type: FieldType.INCREASER_FIELD,
    step: 120,
    max: 600,
    min: 120,
    tooltip: "This is the time given for the user to vacate the parking space after parking expiry.",
    renderValue: value => (value / 60)
  }
];

export { fields };

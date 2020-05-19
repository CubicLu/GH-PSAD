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
    label: 'Parking Grace Period',
    type: FieldType.INCREASER_FIELD,
    step: 300,
    max: 900,
    min: 300,
    tooltip: " Minutes before a car is considered as parked automatically.",
    renderValue: value => (value / 60)
  },
  { name: 'overtime',
    label: 'Minutes of Overtime Allowed',
    type: FieldType.INCREASER_FIELD,
    step: 60,
    max: 6000,
    min: 60,
    tooltip: "When the user's parking transaction has expired, the parking lot can give him enough time to leave and not have to pay extra fee as long as he does not exceed the minutes of overtime allowed.",
    renderValue: value => (value / 60)
  }
];

export { fields };

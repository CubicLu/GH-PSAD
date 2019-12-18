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
    step: 60,
    max: 3540,
    min: 60,
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

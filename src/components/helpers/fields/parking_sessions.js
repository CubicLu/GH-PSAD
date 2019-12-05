
const showFields = [
  { name: 'id', label: 'Transaction number' },
  { name: 'vehicle.plate_number', label: 'Vehicle Plate' },
  { name: 'user_id', label: 'Account Linked' },
  { name: 'kiosk_id', label: 'Kiosk Number' },
  { name: 'created_at', label: 'Date' },
  { name: 'check_in', label: 'Start' },
  { name: 'check_out', label: 'End' },
  { name: 'slot_id', label: 'Parking Space ID' },
  { name: 'fee_applied', label: 'Parking Fee' },
  { name: 'total_price', label: 'Total Fee' },
  { name: 'paid', label: 'Payment Status' },
  { name: 'status', label: 'Parking Session Status' },
  { name: 'payment_method', label: 'Payment Method' },
]

const filterFields = () => [
  { name: 'id', label: 'Transaction number' },
  { name: 'vehicles.plate_number', label: 'Vehicle Plate' },
  { name: 'user_id', label: 'Account Linked' },
  { name: 'kiosk_id', label: 'Kiosk Number'},
  { name: 'created_at', label: 'Date'},
  { name: 'check_in', label: 'Start'},
  { name: 'check_out', label: 'End'},
  { name: 'parking_slots.name', label: 'Parking Space ID'},
  { name: 'total_price', label: 'Parking Fee'},
  { name: 'fee_applied', label: 'Total Fee'},
  { name: 'status', label: 'Status'},
  { name: 'payments.payment_method', label: 'Payment Method'},

]

export { filterFields, showFields };

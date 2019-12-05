
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
  { name: '', label: 'Account Linked' },
  { name: '', label: 'Kiosk Number'},
  { name: '', label: 'Date'},
  { name: '', label: 'Start'},
  { name: '', label: 'End'},
  { name: '', label: 'Parking Space ID'},
  { name: '', label: 'Parking Fee'},
  { name: '', label: 'Total Fee'},
  { name: '', label: 'Status'},
  { name: '', label: 'Payment Method'},

]

export { filterFields, showFields };

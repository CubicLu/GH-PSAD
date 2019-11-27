// Executed every time user clicks on the map when is in editing mode
import { isEmpty } from 'underscore';

const offsetMouse = 15

export function markSlotOnParkingPlan (e) {
  const {
   isInsideEditingZone,
   isEditing,
   newCircleInfo,
   isMovingExistingSlot,
   slotIdClicked
  } = this.state;

  if(isInsideEditingZone && isEditing && isEmpty(newCircleInfo) && this.mapRef.current)  {
    const x = e.clientX, y = e.clientY,
    elementMouseIsOver = document.elementFromPoint(x, y);
    // To avoid mark a new circle when user is selecting an existing circle
    if(!isMovingExistingSlot && elementMouseIsOver !== this.mapRef.current) {
      return
    }

    const offsetX = x - this.mapRef.current.getBoundingClientRect().left - offsetMouse;
    const offsetY = y - this.mapRef.current.getBoundingClientRect().top - offsetMouse;

    this.multiSelectContainerRef.current.style.left = offsetX + 40 + "px"
    this.multiSelectContainerRef.current.style.top = offsetY  + "px"

    this.multiSelectContainerRef.current.focus()

    if(isMovingExistingSlot) {
      // When the user was moving an existing circle
      this.deleteParkingSlotCircle(slotIdClicked)
      this.setState({
        newCircleInfo: {},
        slotIdClicked: null,
        isMovingExistingSlot: false,
        drawedSlotContainer: [
          ...this.state.drawedSlotContainer,
          {
            x: offsetX,
            y: offsetY,
            parking_slot_id: slotIdClicked
          }
        ]
      })
    } else {
      // Create a grey circle where the user clicked while he choose the new slot
      this.setState({
        slotIdClicked: null,
        newCircleInfo:  {
          x: offsetX,
          y: offsetY,
          parking_slot_id: null
        }
      })
    }
  }
}
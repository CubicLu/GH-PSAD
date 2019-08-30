import React from 'react';
import Holder from 'holderjs';
import { Media } from 'reactstrap';

const CustomMedia = (props) => {
  const { filename, filepath } = props
  return (
    <Media className="justify-content-center">
      <Media left>
        <Media object tag={() => (
          <img
            data-src={filepath || 'holder.js/200x200?auto=yes'}
            src={filepath}
            alt={filename}
            className="img-thumbnail"
            ref={ref => Holder.run({ images: ref })}/>
        )}/>
      </Media>
    </Media>
  )
}

export default CustomMedia;
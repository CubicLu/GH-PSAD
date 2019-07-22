import React from 'react';
import { isFunction } from 'underscore';
import { Button, ButtonGroup, ButtonToolbar, Input, InputGroup } from 'reactstrap';

class DynamicToolbar extends React.Component {
  renderBar(bar, idx) {
    <ButtonGroup key={idx} className="mr-1">
      {
        isFunction(bar.render) ? bar.render(bar) : <Button {...bar}>{bar.name}</Button>
      }
    </ButtonGroup>
  }

  render() {
    const { bars } = this.props;

    return (
      <ButtonToolbar className="pb-1 float-right">
        {bars.map((bar, idx) => this.renderBar(bar, idx))}
      </ButtonToolbar>
    );
  }
}

export default DynamicToolbar;

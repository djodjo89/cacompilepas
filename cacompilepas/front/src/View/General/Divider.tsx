import React, {ReactNode} from 'react';

class Divider extends React.Component<{className: string}, any> {
  public render(): ReactNode {
    return (
      <div className={'divider ' + this.props.className}></div>
    )
  }
}

export default Divider;

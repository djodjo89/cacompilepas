import React, {ReactNode} from 'react';
import minusIcon from '../../img/minus-icon-red-t.png';

interface RemoveButtonProps {
    id: string,
    containerClassName?: string,
    imgClassName?: string,
    delete: ((event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void) | undefined,
}

class RemoveButton extends React.Component<RemoveButtonProps, any> {
    public render(): ReactNode {
        return (
            <div className={'col-1 ' + this.props.containerClassName}>
                <img
                    id={this.props.id}
                    src={minusIcon}
                    alt={'Supprimer'}
                    className={'remove-button minus-icon ' + this.props.imgClassName}
                    onClick={this.props.delete}
                />
            </div>
        );
    }
}

export default RemoveButton;

import React, {ChangeEvent, ReactNode} from 'react';

interface InputProps {
    id: string,
    inputType: string,
    placeholder: string,
    checked?: boolean,
    className?: string,
    formGroupClassName?: string;
    onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

class Input extends React.Component<InputProps, {}> {

    private readonly className: string;

    constructor(props: InputProps) {
        super(props);
        this.className = 'form-control text-center mt-0 rounded ' + this.props.className;
    }

    public render(): ReactNode {
        return (
        <div className={'form-group ' + undefined !== this.props.formGroupClassName ? this.props.formGroupClassName : ''}>
            <input type={this.props.inputType}
                   className={this.className}
                   checked={this.props.checked}
                   id={this.props.id}
                   placeholder={this.props.placeholder}
                   onFocus={e => e.target.placeholder = ""}
                   onBlur={e => e.target.placeholder = this.props.placeholder}
                   onKeyDown={this.props.onEnter}
                   onChange={this.props.onChange}
            />
        </div>
        );
    }
}

export default Input;
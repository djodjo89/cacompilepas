import React, {ChangeEvent, ReactNode} from "react";

interface InputProps {
    id: string,
    inputType: string,
    placeholder: string,
    className: string,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

class Input extends React.Component<InputProps, {}> {

    private readonly className: string;

    constructor(props: InputProps) {
        super(props);
        this.className = "form-control text-center mt-0 rounded " + this.props.className;
    }

    public render(): ReactNode {
        return <div className="form-group">
            <input type={this.props.inputType}
                   className={this.className}
                   id={this.props.id}
                   placeholder={this.props.placeholder}
                   onFocus={e => e.target.placeholder = ""}
                   onBlur={e => e.target.placeholder = this.props.placeholder}
                   onChange={this.props.onChange}
            />
        </div>
    }
}

export default Input;
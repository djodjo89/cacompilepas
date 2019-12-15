import React, {ChangeEvent, ReactNode} from "react";

interface InputAreaProps {
    id: string,
    placeholder: string,
    className: string,
    textAreaClassName: string,
    rows: number,
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void,
    disabled: boolean
}

class InputArea extends React.Component<InputAreaProps, {}> {
    public render(): ReactNode {
        return <div className={'form-group ' + this.props.className}>
            <textarea
                      className={'form-control mt-0 rounded-1 ' + this.props.textAreaClassName}
                      id={this.props.id}
                      placeholder={this.props.placeholder}
                      rows={this.props.rows}
                      onFocus={e => e.target.placeholder = ""}
                      onBlur={e => e.target.placeholder = this.props.placeholder}
                      onChange={this.props.onChange}
                      disabled={this.props.disabled}
            >
            </textarea>
        </div>
    }
}

export default InputArea;
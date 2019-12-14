import React, {ChangeEvent, ReactNode} from 'react';
import Request from "../../API/Request";

class Upload extends React.Component {
    private file: any;

    constructor(props: any) {
        super(props);
        this.file = null;
        this.update = this.update.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    public handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        if (null !== event) {
            // @ts-ignore
            this.file = event.target.files[0]
        }
    }

    public update(data: any): void {
        console.log(data);
    }

    public handleSubmit(): void {
        let formData = new FormData();
        formData.append('file', this.file);
        new Request('/lobby/upload-pdf/1', 'POST', this.file.type, formData, this.update);
    }

    public render(): ReactNode {
        return (
            <form>
                <input type={"file"} name={"file"} onChange={this.handleFileChange}/>
                <button type={"button"} className={"btn btn-success btn-block"} onClick={this.handleSubmit}>Upload
                </button>
            </form>
        );
    }
}

export default Upload;
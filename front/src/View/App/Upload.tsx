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
        if (null !== this.file) {
            let formData = new FormData();
            formData.append('file', this.file);
            formData.append('crocodile', 'yes');
            formData.append('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJlbWFpbCI6Im5hYmlsYUBjYWNvbXBpbGVwYXMuY29tIiwicGFzc3dvcmQiOiIkMnkkMTAkRlU1MG9zeTYzY2x4M1ltTWFyT3l2T0xUeEp2R0hsSkc3ODdEMlwvZkxzN3ZOcDRmazdySVwvSyIsInRpbWUiOnsiZGF0ZSI6IjIwMTktMTItMTQgMTk6MzM6MDYuMzE3MjE0IiwidGltZXpvbmVfdHlwZSI6MywidGltZXpvbmUiOiJFdXJvcGVcL1BhcmlzIn19.FlXQl7mpMSGr3O9CrJph72VtLTwhcVSQOIxkMBoI_0f1x0mjp8PBEgrWwv4MzbtMM_us0r578tKlXVzBqSXdRQ39Dg0uzwV8toM7jO2smOZlbT0QM-l4pR2hpOAdNhb_GwfeJML9DzQ8SsQmOfoVxxBgJLRCP8ff6DvnyBbflOs');
            formData.append('title', 'Tro bien le ftp, ouais !');
            formData.append('description', 'Là, vous allez vous amuser :smile:');
            new Request('/lobby/newCourseSheet/1', 'POST', this.file.type, formData, this.update);
        }
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
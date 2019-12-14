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
            formData.append('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJlbWFpbCI6InRob21hc0BjYWNvbXBpbGVwYXMuY29tIiwicGFzc3dvcmQiOiIkMnkkMTAkRlU1MG9zeTYzY2x4M1ltTWFyT3l2T0xUeEp2R0hsSkc3ODdEMlwvZkxzN3ZOcDRmazdySVwvSyIsInRpbWUiOnsiZGF0ZSI6IjIwMTktMTItMTQgMTU6MTU6NTAuNTUyMjc1IiwidGltZXpvbmVfdHlwZSI6MywidGltZXpvbmUiOiJFdXJvcGVcL1BhcmlzIn19.D-Szd9yTTUz4hTZ-m0aht1x3bT1qh-cj9CswBaLc8A2lQHxki-TSjqRNwPTfE7A6xihqhKkKnqOaaUROIDGezcNbN4sKFq8qAg-Xi9VjOvoq7NA-9lLg7p3gHsTX2avWNebO6jY8eXK7KHawfp6_gPsV7BJaYhOAMl8mKjoVdaM');
            formData.append('label', 'Tro bien le ftp');
            formData.append('description', 'Ici vous allez vous amuser :smile:');
            new Request('/lobby/update/1', 'POST', this.file.type, formData, this.update);
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
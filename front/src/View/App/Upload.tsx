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
            formData.append('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJlbWFpbCI6InRob21hc0BjYWNvbXBpbGVwYXMuY29tIiwicGFzc3dvcmQiOiIkMnkkMTAkRlU1MG9zeTYzY2x4M1ltTWFyT3l2T0xUeEp2R0hsSkc3ODdEMlwvZkxzN3ZOcDRmazdySVwvSyIsInRpbWUiOnsiZGF0ZSI6IjIwMTktMTItMTQgMTc6MDA6NTQuODkxODI1IiwidGltZXpvbmVfdHlwZSI6MywidGltZXpvbmUiOiJFdXJvcGVcL1BhcmlzIn19.OjOUMrqiJoxTJDKshVfZJbupcy7-y2M7mrL4V6OZlsPI1-qBDHioG_TOuaXL3Jsr6esFxjRRb8C3vsMYlOSwX_Lu_-GNbuIHlNqRSUJ6KCpCcyKRU7w6S_zOwtI1dVUo4Mmum4uxq3cC-GUR64P5T5Kao2XwoZRcrZ3-TPXWJmg');
            formData.append('title', 'Tro bien le ftp');
            formData.append('description', 'Ici vous allez vous amuser :smile:');
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
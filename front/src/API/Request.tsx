interface RequestProps {
    domain: string;
    method: string;
    route: string;
    data: any;
}

interface IHttpResponse<T> extends Response {
    jsonBody?: T;
}

class Request<T> {
    private route: string;
    private readonly method: string;
    private readonly type: string;
    private readonly data: string;
    private readonly domain: string;
    private beautifulRoute: string;
    private headers: HeadersInit;
    private body: BodyInit;
    private requestInit: RequestInit;
    private response: IHttpResponse<T>;
    private updateFunction: any;
    private returnType: string;

    constructor(beautifulRoute: string, updateFunction: any = (result: any) => console.log(result), method: string = 'GET', data: any = {}, type: string = 'json', returnType: string = 'json') {
        this.beautifulRoute = beautifulRoute;
        this.route = '/';
        this.method = method;
        this.domain = 'http://localhost:80';
        this.type = type;
        this.data = data;
        this.initRoute();
        this.sendRequest();
        this.headers = {};
        this.body = '';
        this.requestInit = {};
        // @ts-ignore
        this.response = {jsonBody: null};
        this.updateFunction = updateFunction;
        this.returnType = returnType;
        this.updateFunction = this.updateFunction.bind(this);
    }

    public initRoute(): void {
        if (undefined !== this.beautifulRoute.split(/\//)[1]) {
            this.route += '?module=' + this.beautifulRoute.split(/\//)[1];
            if (undefined !== this.beautifulRoute.split(/\//)[2]) {
                this.route += '&action=' + this.beautifulRoute.split(/\//)[2];
                if (undefined !== this.beautifulRoute.split(/\//)[3]) {
                    this.route += '&param=' + this.beautifulRoute.split(/\//)[3];
                }
            }
        }
    }

    public sendRequest(): void {

        switch (this.method) {
            case 'POST':
            case 'GET':
                this.headers = undefined !== localStorage.getItem('token') &&
                '' !== localStorage.getItem('token') ?
                    {
                        'Accept': this.type,
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    } :
                    {
                        'Accept': this.type,
                    }
                break;
        }
        let body: any;
        if ('GET' !== this.method) {
            if (null === this.data) {
                body = null;
            } else {
                body = this.type === 'json' ? JSON.stringify(this.data) : this.data;
            }
            this.requestInit = {
                headers: this.headers,
                method: this.method,
                body: body,
            }
        } else {
            this.requestInit = {
                headers: this.headers,
                method: this.method,
            }
        }

        fetch(this.domain + this.route, this.requestInit)
            .then((res: Response) => {
                this.response = res;
                switch (this.returnType) {
                    case 'json':
                        return res.json();
                    case 'blob':
                        return res.blob();
                    default:
                        return res.json();
                }
            })
            .then((jsonResponse: any) => {
                if (this.response.ok) {
                    this.response.jsonBody = jsonResponse;
                    this.updateFunction(this.response.jsonBody);
                } else {
                    throw new Error('Bad response');
                }
            })
            .catch((syntaxError: SyntaxError) => syntaxError)
            .catch((networkError: Error) => networkError);
    }
}

export default Request;

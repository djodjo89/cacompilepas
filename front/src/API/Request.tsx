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

    constructor(beautifulRoute: string, method: string, type: string, data: any, updateFunction: any) {
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
                this.headers =
                    {
                        'Accept': this.type,
                    }
                break;
        }
        let body: any;
        if (null === this.data) {
            body = null;
        }
        else {
            this.type === 'json' ? body = JSON.stringify(this.data) : body = this.data;
        }

        this.requestInit = {
            headers: this.headers,
            method: this.method,
            body: body,
        }

        fetch(this.domain + this.route, this.requestInit)
            .then((res: Response) => {
                this.response = res;
                return res.json();
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

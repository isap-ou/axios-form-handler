import axios, { AxiosError, AxiosInstance, Method } from 'axios';

interface ResponseOption {
    onSuccess?: (data: Record<any, any>) => void;
    onValidationErrors?: (data: Record<any, any>) => void;
    onError?: (error: AxiosError) => void;
    onFinish?: () => void;
}

class Form {
    private readonly _initialData: Record<string, any> = {};
    private _fields: Record<string, any> = {};
    public errors: Record<string, string | null> = {};
    public processing = false;

    private static http: AxiosInstance | null = null;

    [key: string]: any;

    constructor(fields: Record<string, any>) {
        this._initialData = Object.assign({}, fields);
        this._fields = { ...fields };

        // Expose each field as a direct enumerable property (no custom Proxy)
        for (const key of Object.keys(this._fields)) {
            (this as any)[key] = this._fields[key];
            this.errors[key] = null;
            Object.defineProperty(this, key, {
                get() {
                    return this._fields[key];
                },
                set(value) {
                    this._fields[key] = value;
                    if (Object.prototype.hasOwnProperty.call(this.errors, key)) {
                        delete this.errors[key];
                    }
                },
                enumerable: true,
                configurable: true,
            });
        }
    }

    static setAxiosInstance(axiosInstance: AxiosInstance) {
        Form.http = axiosInstance;
    }

    get fields(): Record<string, any> {
        return this._fields;
    }

    get hasErrors(): boolean {
        return Object.keys(this.errors).length > 0;
    }

    clearErrors(): this {
        this.errors = {};
        return this;
    }

    setError(key: string | Record<string, string>, message?: string | null): this {
        if (typeof key === 'object') {
            for (const newKey in key) {
                this.setError(newKey, key[newKey][0]);
            }
        } else {
            this.errors = Object.assign({}, this.errors, { [key]: message });
        }
        return this;
    }

    request(method: Method, url: string, data: Record<string, any> = {}, options: ResponseOption) {
        if (!Form.http) {
            Form.setAxiosInstance(axios.create({}));
        }

        this.processing = true;

        this.clearErrors();

        Form.http!.request({ method, url, ...data })
            .then(({ data }) => {
                if (options.onSuccess) {
                    options.onSuccess(data);
                }
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.status === 422) {
                    const validationErrors = error.response.data as any;
                    if (validationErrors && validationErrors.errors) {
                        this.setError(validationErrors.errors);
                    }

                    if (options.onValidationErrors) {
                        options.onValidationErrors(this.errors);
                    }
                    return;
                }

                if (options.onError) {
                    options.onError(error);
                }
            })
            .finally(() => {
                this.processing = false;
                if (options.onFinish) {
                    options.onFinish();
                }
            });
    }

    post(route: string, options: ResponseOption = {}) {
        this.request('post', route, { data: this.fields }, options);
    }

    put(route: string, options: ResponseOption = {}) {
        this.request('put', route, { data: this.fields }, options);
    }

    patch(route: string, options: ResponseOption = {}) {
        this.request('patch', route, { data: this.fields }, options);
    }

    delete(route: string, options: ResponseOption = {}) {
        this.request('delete', route, {}, options);
    }

    reset(): this {
        this._fields = Object.assign({}, this._initialData);
        for (const key of Object.keys(this._fields)) {
            (this as any)[key] = this._fields[key];
        }
        this.clearErrors();
        return this;
    }
}

export function useForm(fields: Record<string, any>) {
    return new Form(fields);
}

export function setFormAxios(axios: AxiosInstance) {
    Form.setAxiosInstance(axios);
}

export type FormInstance = Form & Record<string, any>;

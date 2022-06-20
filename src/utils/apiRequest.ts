import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

export const apiRequest = (url: string, 
    method: string,
    successMessage?: string,
    body?: object,
    params?: object,
    contentType?: string) => {
    

        const baseUrl = 'https://b-control.herokuapp.com/';

        let jwt = localStorage.getItem('@mr-pig:auth');
        let token: string = `Bearer ${jwt}`;
        
        const options:AxiosRequestConfig = {
            baseURL: baseUrl,
            url: url,
            method: method,
            params: params,
            data: body,
            headers: {
                "Content-Type": contentType || 'application/json',
                Authorization: token
            }
        }

        let data;

        const promisse = toast.promise(axios(options)
            .then(response => data = response.data), {
                success: successMessage ? `${successMessage}` : undefined,
                error: {
                    render({ data }) {
                        
                        if (data.response.status === 403 || data.response.status === 401) {
                            localStorage.removeItem('@mr-pig:auth');
                        }

                        return data.response.data ? data.response.data.message : 'Erro ao realizar operação';
                    }
                }
            });


    return { data, promisse };
}

export default apiRequest;
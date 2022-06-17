import axios, { AxiosRequestConfig, Method } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./auth";

const baseUrl = 'https://b-control.herokuapp.com/';

export function useFetch<T = unknown>(url: string, 
    method: string,
    successMessage?: string,
    body?: object,
    params?: Array<string>,
    contentType?: string) {
    
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {

        let jwt = useAuth().getToken();

        let token: string = `Bearer ${jwt}`
        
        const options:AxiosRequestConfig = {
            baseURL: baseUrl,
            url: url,
            method: method,
            params: params,
            data: body,
            headers: {
                "Content-Type": contentType || '',
                Authotization: jwt ? token : ''
            }
        }

        toast.promise(axios(options)
            .then(response => setData(response.data)), {
                pending: '...',
                success: successMessage ? `${successMessage}` : undefined, // (?)
                error: {
                    render({ data }) {
                        console.log(data);
                        return data.response.data.message;
                    }
                }
            });

    }, []);

    return { data }
}
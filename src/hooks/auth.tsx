import axios from 'axios';
import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';

interface IAuthContext {
    logged: boolean;

    signIn(email: string, password: string, event: any): void;
    signOut(): void;
    getToken(): string | null;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider: React.FC = ({ children }) => {

    const [logged, setLogged] = useState<boolean>(() => {
        const isLogged = localStorage.getItem('@mr-pig:auth');

        return !!isLogged;
    });

    const signIn = (email: string, password: string, event: any) => {
        
        event.preventDefault();

        const body = {
            email: email, 
            password: password
        }

        axios.postForm('https://b-control.herokuapp.com/login', body)
            .then(response => {
                localStorage.setItem('@mr-pig:auth', response.data.accessToken);
                setLogged(true);
            }).catch(error => {
                console.log(error);
                toast.error(error.response.data.message);
            });
    }

    const signOut = () => {
        localStorage.removeItem('@mr-pig:auth');
        setLogged(false);
    }

    const getToken = () => {
        return localStorage.getItem('@mr-pig:auth');
    }

    return (
        <AuthContext.Provider value={{logged, signIn, signOut, getToken}}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(): IAuthContext {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };
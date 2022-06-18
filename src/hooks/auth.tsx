import React, { createContext, useState, useContext } from 'react';
import apiRequest from '../utils/apiRequest';

interface IAuthContext {
    logged: boolean;

    signIn(email: string, password: string, event: any): void;
    signOut(): void;
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

        apiRequest('/login', 
        'POST', 
        'Usuário logado com sucesso', 
        body, 
        undefined, 
        'multipart/form-data')
        .promisse
        .then(data => {
            localStorage.setItem('@mr-pig:auth', data.accessToken);
            setLogged(true);
        });
    }

    const signOut = () => {
        localStorage.removeItem('@mr-pig:auth');
        setLogged(false);
    }

    return (
        <AuthContext.Provider value={{logged, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(): IAuthContext {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };
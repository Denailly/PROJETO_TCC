import React, {useState} from 'react';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/auth';

import {
    Container,
    Logo,
    Form,
    FormTitle,
} from './styles';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');    

    const { signIn } = useAuth();

    return (
        <Container>
            <Logo>
                <img src={logoImg} alt="Mr. Pig" />
                <h2>Mr. Pig</h2>
            </Logo>

            <Form onSubmit={event => signIn(email, password, event)}>
                <FormTitle>Entrar</FormTitle>

                <Input 
                    type="email"
                    placeholder="e-mail"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                    type="password"
                    placeholder="senha"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />

               <Button type="submit">Acessar</Button>
            </Form>
            <p>Não tem uma conta?</p>
            <a href='/cadastrar'><Button >Cadastrar</Button></a>
        </Container>
    );
}

export default SignIn;
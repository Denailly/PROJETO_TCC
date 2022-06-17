import React, { useState } from 'react';


import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
    Container,
    Logo,
    Form,
    FormTitle,
} from './styles';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFetch } from '../../hooks/useFetch';
import axios from 'axios';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');

    let history = useHistory();

    const sendSingUp = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirm) {
            toast.error("Senha e confirmação devem ser iguais!");
            return;
        }

        const body = {
            nome: name,
            email: email,
            password: password
        };

        //useFetch('/usuarios/cadastrar', 'POST', 'Usuário cadastrado com sucesso', body);

        toast.promise(
            axios.post('https://b-control.herokuapp.com/usuarios/cadastrar', {
                nome: name,
                email: email,
                password: password
            })
            .then(() => history.push('/')),
            {
                pending: 'cadastrando...',
                success:'Usuário cadastrado com sucesso',
                error: {
                    render({ data }) {
                        console.log(data);
                        return data.response.data.message;
                    }
                }
            });

    }

    return (
        <Container>
            <Logo>
                <img src={logoImg} alt="Mr. Pig" />
                <h2>Mr. Pig</h2>
            </Logo>

            <Form onSubmit={sendSingUp}>
                <FormTitle>Cadastrar</FormTitle>

                <Input
                    type="text"
                    placeholder="nome"
                    required
                    onChange={(e) => setName(e.target.value)}
                />

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
                <Input
                    type="password"
                    placeholder="confirmar senha"
                    required
                    onChange={(e) => setConfirm(e.target.value)}
                />

                <Button type="submit">Cadastrar</Button>
            </Form>
        </Container>
    );
}

export default SignUp;
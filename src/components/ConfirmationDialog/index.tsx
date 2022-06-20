import React from 'react';
//import Button from '../Button';
import { Container } from './styles';

interface IConfirmationProps {
    resource: string;
    handleDelete: () => any;
    onClose: () => any;
    message: string;

}

const ConfirmationDialog: React.FC<IConfirmationProps> = ({
    resource,
    handleDelete,
    onClose,
    message
}) => {
    return (

        <Container>
            <h1>Deletar {resource}</h1>
            <p>{message}</p>
            <button type='button' onClick={onClose}>Não</button>
            <button
                onClick={() => {
                    handleDelete();
                    onClose();
                }}
            >
                Sim, apagar!
            </button>
        </Container>
    )
};

export default ConfirmationDialog;
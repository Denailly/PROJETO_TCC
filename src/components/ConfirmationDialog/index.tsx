import React from 'react';
//import Button from '../Button';
import { Container } from './styles';

interface IConfirmationProps {
    resource: string;
    handleDelete: () => any;
    onClose: () => any;

}

const ConfirmationDialog: React.FC<IConfirmationProps> = ({
    resource,
    handleDelete,
    onClose
}) => {
    return (

        <Container>
            <h1>Deletar {resource}</h1>
            <p>Tem certeza que deseja apagar {resource}?</p>
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
)};

export default ConfirmationDialog;
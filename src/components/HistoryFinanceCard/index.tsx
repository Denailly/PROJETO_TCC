import React from 'react';

import { Container, Tag } from './styles';
import {
    MdModeEdit,
    MdDelete
} from 'react-icons/md';
import apiRequest from '../../utils/apiRequest';
import { IRenderList } from '../../pages/List';
import { confirmAlert } from 'react-confirm-alert';
import ConfirmationDialog from '../ConfirmationDialog';

interface IHistoryFinanceCardProps {
    cardId: number;
    tagColor: string;
    title: string;
    subtitle: string;
    amount: string;
    cardType: string;
    render:IRenderList;

}

const HistoryFinanceCard: React.FC<IHistoryFinanceCardProps> = ({
    tagColor,
    title,
    subtitle,
    amount,
    cardId,
    cardType,
    render
}) => {

    const handleDelete = () => {

        apiRequest(`/${cardType}s/${cardId}`, 'DELETE', `${cardType} deletada com sucesso`)
        .promisse
        .then(data => render.render(render.workAround + 1));
    }

    const deleteDialog = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <ConfirmationDialog 
                    resource={cardType}
                    onClose={onClose}
                    handleDelete={handleDelete}
                    message={`Tem certeza que deseja apagar ${cardType}?`}
                />
              );
            }
          });
          
    }

    return (
    <Container>
        <Tag color={tagColor} />
        <div>
            <span>{title}</span>
            <small>{subtitle}</small>
        </div>
        <div className='controller'>
            <h3>{amount}</h3>
            <div className="buttons">
                <div className="editar">
                    <button>
                        <MdModeEdit />
                    </button>
                </div>
                <div className="excluir" onClick={deleteDialog}>
                    <button>
                        <MdDelete />
                    </button>
                </div>
            </div>
        </div>
    </Container>
)};


export default HistoryFinanceCard;
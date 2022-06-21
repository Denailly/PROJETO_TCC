import React from 'react';

import { Container, Tag } from './styles';
import {
    MdModeEdit,
    MdDelete
} from 'react-icons/md';
import apiRequest from '../../utils/apiRequest';
import { IData, IRenderList } from '../../pages/List';
import { confirmAlert } from 'react-confirm-alert';
import ConfirmationDialog from '../ConfirmationDialog';
import formatCurrency from '../../utils/formatCurrency';

interface IHistoryFinanceCardProps {
    data: IData
    cardType: string;
    render: IRenderList;
    openModal: (data: IData) => void;
}

const HistoryFinanceCard: React.FC<IHistoryFinanceCardProps> = ({
    data,
    cardType,
    render,
    openModal
}) => {

    const handleDelete = () => {

        apiRequest(`/${cardType}s/${data.id}`, 'DELETE', `${cardType} deletada com sucesso`)
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
        <Container onClick={() => openModal(data)}>
            <Tag color={data.category.color} />
            <div>
                <span>{data.description}</span>
                <small>{data.dateFormatted}</small>
            </div>
            <div className='controller'>
                <h3>{formatCurrency(Number(data.amountFormatted))}</h3>
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
    )
};


export default HistoryFinanceCard;

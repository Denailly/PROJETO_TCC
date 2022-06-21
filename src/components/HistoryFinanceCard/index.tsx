import React from 'react';

import { Container, Tag } from './styles';
import {
    MdModeEdit,
} from 'react-icons/md';
import { IData, IRenderList } from '../../pages/List';
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

    return (
        <Container onClick={() => openModal(data)}>
            <Tag color={data.category.color} />
            <div>
                <span>{data.description}</span>
                <small>{data.dateFormatted}</small>
            </div>
            <div className='right-side'>
                <h3>{formatCurrency(Number(data.amountFormatted))}</h3>
                <div className="editar">
                    <button>
                        <MdModeEdit />
                    </button>
                </div>
            </div>


        </Container>
    )
};


export default HistoryFinanceCard;

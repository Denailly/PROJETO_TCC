import React, { useMemo, useState, useEffect } from 'react';

import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

import formatCurrency from '../../utils/formatCurrency';
import listOfMonths from '../../utils/months';

import {
    Category,
    Container,
    Content,
    EditButtons,
    Filters
} from './styles';
import apiRequest from '../../utils/apiRequest';
import useYears from '../../hooks/useYears';
import Modal from 'react-modal';
import ModalCategories from '../../components/ModalCategoies';
import FinanceForm from '../../components/FinanceForm';

interface IRouteParams {
    match: {
        params: {
            type: string;
        }
    }
}

export interface IData {
    id: number;
    description: string;
    amountFormatted: string;
    category: ICategory;
    dateFormatted: string;
    tagColor: string;
}

export interface ICategory {
    categoryId: number;
    description: string;
    movimentType: string;
    color: string;
}

export interface IRenderList {
    workAround: number;
    render: React.Dispatch<React.SetStateAction<number>>
}

const List: React.FC<IRouteParams> = ({ match }) => {
    const [data, setData] = useState<IData[]>([]);
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [categoryFilterSelected, setCategoryFilterSelected] = useState<number[]>([]);
    const [shouldRender, setSholdRender] = useState<number>(0);
    const [categoryModalOpen, setCategoryOpen] = useState(false);
    const [cardModal, setCardModalOpen] = useState(false);

    const movimentType = match.params.type;
    Modal.setAppElement('#root');

    const pageData = useMemo(() => {
        return movimentType === 'entry-balance' ?
            {
                title: 'Entradas',
                lineColor: '#2f903f',
            }
            :
            {
                title: 'Saídas',
                lineColor: '#E44C4E',
            }
    }, [movimentType]);


    const years = useYears().map(year => {
        return {
            value: year,
            label: year,
        }

    });


    const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month,
            }
        });
    }, []);


    const handleCategoryClick = (frequency: number) => {
        const alreadySelected = categoryFilterSelected.findIndex(item => item === frequency);

        if (alreadySelected >= 0) {
            const filtered = categoryFilterSelected.filter(item => item !== frequency);
            setCategoryFilterSelected(filtered);
        } else {
            setCategoryFilterSelected((prev) => [...prev, frequency]);
        }
    }

    const handleMonthSelected = (month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        }
        catch {
            throw new Error('invalid month value. Is accept 0 - 24.')
        }
    }

    const handleYearSelected = (year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        }
        catch {
            throw new Error('invalid year value. Is accept integer numbers.')
        }
    }

    useEffect(() => {
        apiRequest('/categorias',
            'GET',
            undefined,
            undefined,
            {
                tipo: movimentType === 'entry-balance' ? 'RECEITA' : 'DESPESA'
            })
            .promisse
            .then(data => {
                const categories: ICategory[] = data
                    .map(categoria => {

                        let category: ICategory = {
                            categoryId: categoria.id,
                            description: categoria.descricao,
                            movimentType: categoria.tipo,
                            color: categoria.cor
                        }

                        return category;
                    })

                setCategories(categories);
                setCategoryFilterSelected(categories.map(category => category.categoryId));
            })


    }, [movimentType, shouldRender])

    useEffect(() => {

        let url: string = movimentType === 'entry-balance' ? 'receitas' : 'despesas';

        const param = new URLSearchParams();
        categoryFilterSelected.forEach(category => param.append('categoriaIds', category.toFixed(0)));
        param.append('ano', yearSelected.toFixed(0));
        param.append('mes', monthSelected.toFixed(0));



        apiRequest(`/${url}`,
            'GET',
            undefined,
            undefined,
            param)
            .promisse
            .then(dados => {

                let cards = dados.map(item => {
                    return {
                        id: item.id,
                        description: item.descricao,
                        amountFormatted: formatCurrency(Number(item.valor)),
                        category: item.categoria,
                        dateFormatted: item.data,
                        tagColor: item.categoria.cor
                    }
                })

                setData(cards);


            });
    }, [monthSelected, yearSelected, categoryFilterSelected, movimentType, shouldRender]);


    return (
        <Container>
            <ContentHeader title={pageData.title} lineColor={pageData.lineColor}>
                <SelectInput
                    options={months}
                    onChange={(e) => handleMonthSelected(e.target.value)}
                    defaultValue={monthSelected}
                />
                <SelectInput
                    options={years}
                    onChange={(e) => handleYearSelected(e.target.value)}
                    defaultValue={yearSelected}
                />
            </ContentHeader>

            <Filters>
                {
                    categories.map(category => (
                        <Category
                            type="button"
                            color={category.color}
                            key={category.categoryId}
                            className={`
                                ${categoryFilterSelected.includes(category.categoryId) && 'tag-actived'}
                            `}
                            onClick={() => handleCategoryClick(category.categoryId)}
                        >
                            {category.description}
                        </Category>
                    ))
                }
            </Filters>

            <EditButtons>
                <button onClick={() => setCategoryOpen(true)}>
                    Editar categorias
                </button>
                <button onClick={() => setCardModalOpen(true)}>
                    Cadastrar nova {movimentType === 'entry-balance' ? 'entrada' : 'saída'}
                </button>
            </EditButtons>

            <Content>
                {
                    data.map(item => (
                        <HistoryFinanceCard
                            key={item.id}
                            tagColor={item.tagColor}
                            title={item.description}
                            subtitle={item.dateFormatted}
                            amount={item.amountFormatted}
                            cardId={item.id}
                            cardType={movimentType === 'entry-balance' ? 'receita' : 'despesa'}
                            render={{
                                workAround: shouldRender,
                                render: setSholdRender
                            }}
                        />
                    ))
                }
            </Content>
            <ModalCategories 
                categories={categories}
                isOpen={categoryModalOpen}
                setOpen={setCategoryOpen}
                render={{
                    workAround: shouldRender,
                    render: setSholdRender
                }}
            />

            <Modal
                isOpen={cardModal}
                onRequestClose={() => setCardModalOpen(false)}
                contentLabel="Modal card"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <FinanceForm
                    movimentType={movimentType === 'entry-balance' ? 'entrada' : 'saída'}
                    categories={categories}
                    render={{
                        workAround: shouldRender,
                        render: setSholdRender
                    }}
                    >

                </FinanceForm>
            </Modal>
        </Container>
    );
}

export default List;
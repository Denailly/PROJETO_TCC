import React, { useState, useMemo, useCallback, useEffect } from 'react';


import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import WalletBox from '../../components/WalletBox';
import MessageBox from '../../components/MessageBox';
import PieChartBox from '../../components/PieChartBox';
import HistoryBox from '../../components/HistoryBox';
import BarChartBox from '../../components/BarChartBox'

import expenses from '../../repositories/expenses';
import gains from '../../repositories/gains';
import listOfMonths from '../../utils/months';

import happyImg from '../../assets/happy.svg';
import sadImg from '../../assets/sad.svg';
import grinningImg from '../../assets/grinning.svg';
import opsImg from '../../assets/ops.svg';


import {
    Container,
    Content,
} from './styles';
import apiRequest from '../../utils/apiRequest';

interface IValuesPerCategory {
    value: number;
    category: {
        color: string;
        description: string;
    }
}

interface IBalance {
    finalBalance: number;
    totalGains: number;
    totalExpenses: number;
    expensesPerCategory: IValuesPerCategory[];
    gainsPerCategory: IValuesPerCategory[];
}

const Dashboard: React.FC = () => {
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
    const [balance, setBalance] = useState<IBalance>({ 
        finalBalance: 0, 
        totalGains: 0, 
        totalExpenses: 0,
        expensesPerCategory:[],
        gainsPerCategory:[] 
    });
    const [yearsAvaiable, setYearAvaiable] = useState<number[]>([new Date().getFullYear()]);

    useEffect(() => {
        apiRequest('usuarios/anos-movimentados', 'GET')
        .promisse
        .then(data => {
            setYearAvaiable(data);
        })
    },[]);

    useEffect(() => {
        apiRequest(`/resumo/${yearSelected}/${monthSelected}`, 'GET')
            .promisse
            .then(data => {
                let balance: IBalance = {
                    finalBalance: data.saldoFinal,
                    totalGains: data.totalReceitas,
                    totalExpenses: data.totalDespesas,
                    expensesPerCategory: data.gastosPorCategoria
                        .map(expense => {
                            return {
                                value: expense.valor,
                                category: {
                                    color: expense.categoria.cor,
                                    description: expense.categoria.descricao
                                }
                            }
                        }),
                    gainsPerCategory: data.recebidosPorCategoria
                        .map(gain => {
                            return {
                                value: gain.valor,
                                category: {
                                    color: gain.categoria.cor,
                                    description: gain.categoria.descricao
                                }
                            }
                        })
                };

                setBalance(balance);
            });
    }, [yearSelected, monthSelected]);

    const years = useMemo(() => {

        return yearsAvaiable.map(year => {
            return {
                value: year,
                label: year,
            }
        });
    }, [yearsAvaiable]);


    const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month,
            }
        });
    }, []);

    const message = useMemo(() => {
        if (balance.finalBalance < 0) {
            return {
                title: "Que triste!",
                description: "Neste mês, você gastou mais do que recebeu.",
                footerText: "Verifique seus gastos e tente organizar suas prioridades.",
                icon: sadImg
            }
        }
        else if (balance.totalGains === 0 && balance.totalExpenses === 0) {
            return {
                title: "Op's!",
                description: "Neste mês, não há registros de entradas ou saídas.",
                footerText: "Parece que você não fez nenhum registro no mês e ano selecionado.",
                icon: opsImg
            }
        }
        else if (balance.finalBalance === 0) {
            return {
                title: "Ufaa!",
                description: "Neste mês, você gastou exatamente o que ganhou.",
                footerText: "Tenha cuidado. No próximo tente poupar o seu dinheiro.",
                icon: grinningImg
            }
        }
        else {
            return {
                title: "Muito bem!",
                description: "Sua carteira está positiva!",
                footerText: "Continue assim. Considere investir o seu saldo.",
                icon: happyImg
            }
        }

    }, [balance]);

    const relationExpensesVersusGains = useMemo(() => {
        const total = balance.totalGains + balance.totalExpenses;

        const percentGains = Number(((balance.totalGains / total) * 100).toFixed(1));
        const percentExpenses = Number(((balance.totalExpenses / total) * 100).toFixed(1));

        const data = [
            {
                name: "Entradas",
                value: balance.totalGains,
                percent: percentGains ? percentGains : 0,
                color: '#3a9449'
            },
            {
                name: "Saídas",
                value: balance.totalExpenses,
                percent: percentExpenses ? percentExpenses : 0,
                color: '#E44C4E'
            },
        ];

        return data;
    }, [balance]);

    const historyData = useMemo(() => {
        return listOfMonths
            .map((_, month) => {

                let amountEntry = 0;
                gains.forEach(gain => {
                    const date = new Date(gain.date);
                    const gainMonth = date.getMonth();
                    const gainYear = date.getFullYear();

                    if (gainMonth === month && gainYear === yearSelected) {
                        try {
                            amountEntry += Number(gain.amount);
                        } catch {
                            throw new Error('amountEntry is invalid. amountEntry must be valid number.')
                        }
                    }
                });

                let amountOutput = 0;
                expenses.forEach(expense => {
                    const date = new Date(expense.date);
                    const expenseMonth = date.getMonth();
                    const expenseYear = date.getFullYear();

                    if (expenseMonth === month && expenseYear === yearSelected) {
                        try {
                            amountOutput += Number(expense.amount);
                        } catch {
                            throw new Error('amountOutput is invalid. amountOutput must be valid number.')
                        }
                    }
                });


                return {
                    monthNumber: month,
                    month: listOfMonths[month].substr(0, 3),
                    amountEntry,
                    amountOutput
                }
            })
            .filter(item => {
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                return (yearSelected === currentYear && item.monthNumber <= currentMonth) || (yearSelected < currentYear)
            });
    }, [yearSelected]);

    const relationExpensevesRecurrentVersusEventual = useMemo(() => {

        return balance.expensesPerCategory
            .map(expense => {
                return {
                    name: expense.category.description,
                    amount: expense.value,
                    percent: Number(((expense.value / balance.totalExpenses) * 100).toFixed(1)),
                    color: expense.category.color
                }
            });
    }, [balance]);


    const relationGainsRecurrentVersusEventual = useMemo(() => {
        return balance.gainsPerCategory
            .map(gain => {
                return {
                    name: gain.category.description,
                    amount: gain.value,
                    percent: Number(((gain.value / balance.totalGains) * 100).toFixed(1)),
                    color: gain.category.color
                }
            });
    }, [balance]);

    const handleMonthSelected = useCallback((month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        }
        catch {
            throw new Error('invalid month value. Is accept 0 - 24.')
        }
    }, []);


    const handleYearSelected = useCallback((year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        }
        catch {
            throw new Error('invalid year value. Is accept integer numbers.')
        }
    }, []);


    return (
        <Container>
            <ContentHeader title="Dashboard" lineColor="#584bec">
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

            <Content>
                <WalletBox
                    title="saldo"
                    color="#584bec"
                    amount={balance.finalBalance}
                    footerlabel="atualizado com base nas entradas e saídas do mês"
                    icon="pig"
                />

                <WalletBox
                    title="entradas"
                    color="#3ba84d"
                    amount={balance.totalGains}
                    footerlabel="atualizado com base nas entradas e saídas do mês"
                    icon="arrowUp"
                />

                <WalletBox
                    title="saídas"
                    color="#b0383a"
                    amount={balance.totalExpenses}
                    footerlabel="atualizado com base nas entradas e saídas do mês"
                    icon="arrowDown"
                />

                <MessageBox
                    title={message.title}
                    description={message.description}
                    footerText={message.footerText}
                    icon={message.icon}
                />

                <PieChartBox data={relationExpensesVersusGains} />

                <HistoryBox
                    data={historyData}
                    lineColorAmountEntry="#3a9449"
                    lineColorAmountOutput="#E44C4E"
                />

                <BarChartBox
                    title="Saídas"
                    data={relationExpensevesRecurrentVersusEventual}
                />

                <BarChartBox
                    title="Entradas"
                    data={relationGainsRecurrentVersusEventual}
                />

            </Content>
        </Container>
    );
}

export default Dashboard;
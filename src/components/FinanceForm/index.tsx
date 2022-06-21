import React, { useState } from "react";
import { ICategory, IData, IRenderList } from "../../pages/List";
import apiRequest from "../../utils/apiRequest";
import SelectInput from "../SelectInput";
import { Form } from "./styles";
import NumberFormat from 'react-number-format';


interface IFinanceFormProps {
    movimentType: string;
    categories: ICategory[];
    financeRecord?: IData;
    render:IRenderList;
}

const FinanceForm: React.FC<IFinanceFormProps> = ({
    movimentType,
    financeRecord,
    categories,
    render
}) => {

    const [description, setDescription] = useState(financeRecord?.description || '');
    const [amount, setAmount] = useState(financeRecord?.amountFormatted || '');
    const [date, setDate] = useState(financeRecord?.dateFormatted || new Date().toISOString().split('T')[0])

    const categoryOptions = categories.map(category => {
        return {
            value: category.categoryId,
            label: category.description
        }
    });


    const [categorySelected, setCategory] = useState(
        financeRecord?.category.categoryId.toString
        ||
        categoryOptions[0].value.toFixed(0));


    const handlePost = (url: string, body: object): Promise<any> => {

        return apiRequest(url, 'POST', `${movimentType} cadastrado com sucesso!`, body)
            .promisse;
    };

    const handleUpdate = (url: string, body: object): Promise<any> => {

        return apiRequest(`${url}/${financeRecord?.id}`,
            'PUT',
            `${movimentType} cadastrado com sucesso!`,
            body)
            .promisse;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const url = movimentType === 'saída'
            ? `/despesas`
            : `/receitas`;

        const data = () => {
            const splited = date.split('-');
            return `${splited[2]}/${splited[1]}/${splited[0]}`;
        };

        const body = {
            descricao: description,
            valor: Number(amount),
            data: data(),
            categoriaId: Number(categorySelected)
        }

        const promisse = financeRecord ? handleUpdate(url, body) : handlePost(url, body);

        promisse.then(data => render.render(render.workAround + 1));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h1>Adicionar {movimentType}</h1>
            <input
                required
                placeholder="Descrição"
                value={description}
                onChange={event => setDescription(event.target.value)}
            />

            <NumberFormat 
                required
                placeholder="R$ 0,00"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                allowNegative={false}
                prefix="R$ "
                value={amount}
                onValueChange={(values, sourceInfo) => {
                    setAmount(values.value);
                }}
                isNumericString={true}
            />

            <input
                type="date"
                required
                value={date}
                onChange={event => setDate(event.target.value)}
            />

            <SelectInput
                options={categoryOptions}
                onChange={event => setCategory(event.target.value)}
                defaultValue={categorySelected}

            />

            <button type="submit">Salvar!</button>
        </Form>
    );
}

export default FinanceForm;
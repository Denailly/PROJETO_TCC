import React, { useState } from "react";
import { ICategory, IData, IRenderList } from "../../pages/List";
import apiRequest from "../../utils/apiRequest";
import Input from "../Input";
import SelectInput from "../SelectInput";
import { Form } from "./styles";

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
    const [amount, setAmount] = useState(financeRecord?.amountFormatted || '0,00');
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

    console.log(categorySelected);

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
            <Input
                placeholder="Descrição"
                value={description}
                onChange={event => setDescription(event.target.value)}
            >
            </Input>
            <Input
                placeholder="Valor"
                value={amount}
                onChange={event => setAmount(event.target.value)}
            >

            </Input>
            <Input
                type="date"

                value={date}
                onChange={event => setDate(event.target.value)}
            >

            </Input>

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
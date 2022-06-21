import React, { useState } from "react";
import { ICategory, IData, IRenderList } from "../../pages/List";
import apiRequest from "../../utils/apiRequest";
import SelectInput from "../SelectInput";
import { Form, TitleContainer, NewGains, SaveButton } from "./styles";
import NumberFormat from "react-number-format";

interface IFinanceFormProps {
  movimentType: string;
  categories: ICategory[];
  financeRecord?: IData;
  render: IRenderList;
}

const FinanceForm: React.FC<IFinanceFormProps> = ({
  movimentType,
  financeRecord,
  categories,
  render,
}) => {
  const [description, setDescription] = useState(
    financeRecord?.description || ""
  );
  const [amount, setAmount] = useState(financeRecord?.amountFormatted || "");

  const categoryOptions = categories.map((category) => {
    return {
      value: category.categoryId,
      label: category.description,
    };
  });

  const unformat = () => {
    const splited = financeRecord?.dateFormatted.split("/") || "";
    return `${splited[2]}-${splited[1]}-${splited[0]}`;
  };

  const unformated: string | undefined = financeRecord ? unformat() : undefined;

  const [date, setDate] = useState(
    unformated || new Date().toISOString().split("T")[0]
  );
  const [categorySelected, setCategory] = useState(
    financeRecord?.category.categoryId.toFixed(0) ||
      categoryOptions[0].value.toFixed(0)
  );

  const handlePost = (url: string, body: object): Promise<any> => {
    return apiRequest(
      url,
      "POST",
      `${movimentType} cadastrado com sucesso!`,
      body
    ).promisse;
  };

  const handleUpdate = (url: string, body: object): Promise<any> => {
    return apiRequest(
      `${url}/${financeRecord?.id}`,
      "PUT",
      `${movimentType} cadastrado com sucesso!`,
      body
    ).promisse;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const url = movimentType === "saída" ? `/despesas` : `/receitas`;

    const data = () => {
      const splited = date.split("-");
      return `${splited[2]}/${splited[1]}/${splited[0]}`;
    };

    const body = {
      descricao: description,
      valor: Number(amount),
      data: data(),
      categoriaId: Number(categorySelected),
    };

    const promisse = financeRecord
      ? handleUpdate(url, body)
      : handlePost(url, body);

    promisse.then((data) => render.render(render.workAround + 1));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TitleContainer lineColor={"#2f903f"}>
        <h1>Adicionar {movimentType}</h1>
      </TitleContainer>
      <NewGains>
        <input
          required
          placeholder="Descrição"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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
          onChange={(event) => setDate(event.target.value)}
        />

        <SelectInput
          options={categoryOptions}
          onChange={(event) => setCategory(event.target.value)}
          defaultValue={categorySelected}
        />
      </NewGains>
      <SaveButton type="submit">Salvar!</SaveButton>
    </Form>
  );
};

export default FinanceForm;

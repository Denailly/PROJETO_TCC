import React, { useMemo, useState } from 'react';

import { IRenderList } from "../../pages/List"
import { Form } from './styles';
import { SketchPicker } from 'react-color';
import apiRequest from '../../utils/apiRequest';
import { confirmAlert } from 'react-confirm-alert';
import ConfirmationDialog from '../ConfirmationDialog';

interface ICategoryEdit {
    categoryId: number;
    color: string;
    description: string;
    movimentType: string;
    render: IRenderList;
}

export const EditCategory: React.FC<ICategoryEdit> = ({
    categoryId,
    color,
    description,
    movimentType,
    render
}) => {

    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [pickedColor, setColorPicked] = useState(color);
    const [typedDescription, setDescriptionTyped] = useState(description);

    const styles = useMemo(() => {
        return {
            color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: pickedColor,
            } as React.CSSProperties,
            swatch: {
                padding: '5px',
                background: pickedColor,
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
            },
            popover: {
                position: 'absolute',
                zIndex: 2,
            } as React.CSSProperties,
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            } as React.CSSProperties,
        }
    }, [pickedColor])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const method = categoryId === 0 ? 'POST' : 'PUT';
        const url = categoryId === 0 ? '/categorias' : `/categorias/${categoryId}`;
        const sucessMessage = categoryId === 0 ? 'Categoria cadastrada com sucesso' : 'Categoria atualizada com sucesso';
        const body = {
            descricao: typedDescription,
            cor: pickedColor,
            tipo: movimentType
        }

        apiRequest(url, method, sucessMessage, body)
            .promisse
            .then(data => render.render(render.workAround + 1));
    }

    const handleDelete = () => {
        apiRequest(`/categorias/${categoryId}`, 'DELETE', 'Categoria deletada com sucesso')
            .promisse
            .then(data => render.render(render.workAround + 1));
    }

    const deleteDialog = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmationDialog
                        resource={'Categoria'}
                        onClose={onClose}
                        handleDelete={handleDelete}
                        message={`Todas as ${movimentType.toLowerCase()}s dessa categoria também serão apagadas`}
                    />
                );
            }
        });

    }

    return (
        <Form onSubmit={handleSubmit}>

            <input type='text'
                required
                placeholder='Criar categoria'
                defaultValue={description}
                onChange={(e) => setDescriptionTyped(e.target.value)}
            >

            </input>
            <div>
                <div style={styles.swatch} onClick={() => setDisplayColorPicker(!displayColorPicker)}>
                    <div style={styles.color} />
                </div>
                {
                    displayColorPicker ?
                        <div style={styles.popover}>
                            <div style={styles.cover} onClick={() => setDisplayColorPicker(false)} />
                            <SketchPicker color={pickedColor} onChange={color => setColorPicked(color.hex)} />
                        </div> : null
                }

            </div>
            <button type='submit'>{categoryId === 0 ? 'Salvar' : 'Editar'}</button>
            {categoryId !== 0 && <button type='button' onClick={deleteDialog}>Excluir</button>}
        </Form>
    )
};

export default EditCategory;
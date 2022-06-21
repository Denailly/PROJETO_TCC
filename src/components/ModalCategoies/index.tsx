import React, { useState } from "react";
import Modal from 'react-modal';
import { ICategory, IRenderList } from "../../pages/List";
import EditCategory from "../EditCategory";
import { TitleContainer } from "./styles";

interface IModalCategories {
    isOpen: boolean;
    categories: ICategory[];
    setOpen: (open:boolean) => any;
    render: IRenderList;
}

export const ModalCategories: React.FC<IModalCategories> = ({
    isOpen,
    categories,
    setOpen,
    render
}) => {
    return (
        <Modal
                isOpen={isOpen}
                onRequestClose={() => setOpen(false)}
                contentLabel="Editar categorias"
                className="modal-content"
                overlayClassName="modal-overlay"

            >
               <TitleContainer lineColor={'#584bec'}>
                <h1>Editar categorias</h1>
                </TitleContainer>
                {
                    categories.map(category => (

                        <EditCategory 
                            categoryId={category.categoryId}
                            color={category.color}
                            description={category.description}
                            movimentType={category.movimentType}
                            key={category.categoryId}
                            render={render}
                        />
                    ))

                    
                }

                        <EditCategory 
                            categoryId={0}
                            color="#ffffff"
                            description=""
                            movimentType={categories[0] ? categories[0].movimentType : 'RECEITA'}
                            render={render}
                        />
            </Modal>
    );
}

export default ModalCategories;
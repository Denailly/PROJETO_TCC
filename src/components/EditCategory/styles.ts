import styled from "styled-components";

export const Container = styled.div`

    >Form:last-child{
        margin-top: 7px;
    }
`

export const Form = styled.form`
    display: flex;
    justify-content: space-between;
    flex-direction: row;

    @media(max-width: 420px){
        flex-direction: column;
    }
`;

export const ButtonEditCategory = styled.button`
    margin: 5px 10px;
    padding: 5px 5px 5px 5px;
    background-color: ${props => props.theme.colors.info};
    color: ${props => props.theme.colors.white};
    border-radius: 5px;
    font-size: 16px;

    @media(max-width: 420px) {
        flex:1;
    }
`;

export const ButtonDeleteCategory = styled.button`
    margin: 2px 10px;
    padding: 5px 5px 5px 5px;
    background-color: ${props => props.theme.colors.warning};
    color: ${props => props.theme.colors.white};
    border-radius: 5px;
    font-size: 16px;

    @media(max-width: 420px) {
        flex:1;
    }
`

export const ColorPickerCategories = styled.div`
    padding-top: 10px;
    margin: 0px;
`
export const NewCategories = styled.input`
    
    font-size: 16px;
    padding: 5px 20px;
    margin: 10px 10px;
    border-radius: 10px;
    background-color: ${props => props.theme.colors.tertiary};
    color: ${props => props.theme.colors.white};
    
`
export const TopDiv = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
`;

export const ButtonsDiv = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;

    @media(max-width: 420px){
        justify-content: center;
    }
`;
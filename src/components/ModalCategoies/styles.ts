import styled from "styled-components";

interface ITitleContainerProps {
    lineColor: string;
}

export const Form = styled.form`
    display: flex;
    flex-direction: row;
`;

export const TitleContainer = styled.div<ITitleContainerProps>`

    > h1 {
        color: ${props => props.theme.colors.white};

        &::after {
            content: '';
            display: block;
            width: 55px;
            border-bottom: 10px solid ${props => props.lineColor};
        }
    }

    @media(max-width: 420px){
        > h1 {
                font-size: 22px;

                &::after {
                content: '';
                display: block;
                width: 55px;
                border-bottom: 5px solid ${props => props.lineColor};
            }
        }
    }
`;

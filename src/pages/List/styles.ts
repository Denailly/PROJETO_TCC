import styled from 'styled-components';

interface ICategoryProps{
    color: string;
}

export const Container = styled.div``;

export const Content = styled.main``;

export const Category = styled.button<ICategoryProps>`
        font-size: 18px;
        font-weight: 500;

        background: none;
        color: ${props => props.theme.colors.white};

        margin: 0 10px;
        
        opacity: .4;
        transition: opacity .3s;

        &:hover {
            opacity: .7;
        }

        &::after {
            content: '';
            display: block;
            width: 55px;
            margin: 0 auto;
            border-bottom: 10px solid ${props => props.color};
        }
`;

export const Filters = styled.div`
    width: 100%;
    
    display: flex;
    justify-content: center;
    
    margin-bottom: 30px;
    
    .tag-actived {
       opacity: 1;
    }
`;
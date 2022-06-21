import styled from "styled-components";

interface ITitleContainerProps {
  lineColor: string;
}

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const TitleContainer = styled.div<ITitleContainerProps>`
  > h1 {
    color: ${(props) => props.theme.colors.white};

    &::after {
      content: "";
      display: block;
      width: 55px;
      border-bottom: 10px solid ${(props) => props.lineColor};
    }
  }
`;

export const NewGains = styled.div`
  > input {
    font-size: 16px;
    padding: 5px 20px;
    margin: 10px 10px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.colors.tertiary};
    color: ${(props) => props.theme.colors.white};
  }
`;
export const SaveButton = styled.button`
    margin: 10px;
    padding: 5px 5px 5px 5px;
    background-color: ${(props) => props.theme.colors.warning};
    color: ${(props) => props.theme.colors.white};
    border-radius: 5px;
    font-size: 16px;
`;

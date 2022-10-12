import styled from 'styled-components'

export const Wrapper = styled.div`
  background: var(--prussianBlue);
  min-height: 80px;
  margin-top: auto;
  padding: 0 20px;
  width:100%;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--maxWidth);
  padding: 20px 0;
  margin: 0 auto;
  color: var(--white);
  a{
    color: var(--white);
    text-decoration: none;
  }
`;
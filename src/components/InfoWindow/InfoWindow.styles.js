import styled from 'styled-components'

export const Wrapper = styled.div`
  padding: 1em;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  font-size: var(--fontMed);
  
  span{
    display: ${({name}) => name==='Bucharest' ? 'none' : 'block'};
  }
`;
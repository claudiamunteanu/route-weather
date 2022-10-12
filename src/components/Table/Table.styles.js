import styled from 'styled-components'

export const Wrapper = styled.div`
`;

export const Content = styled.div`
  table {
    border-collapse: collapse;
    max-width: 900px;
    width: 100%;
    margin: 2rem auto;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }
  table thead tr {
    background-color: var(--maizeCrayola);
    text-align: left;
  }
  table tbody tr{
    border-bottom: 1px solid #dddddd;
    background-color: var(--white);
  }
  table tbody tr:nth-of-type(even){
    background-color: #f3f3f3;
  }
  
  table tbody tr:last-of-type {
    border-bottom: 5px solid var(--maizeCrayola);
  }

  table th, table td {
    padding: 12px 15px;
    font-size: var(--fontMed);
    font-weight: bold;
  }
  
  img{
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background-color: var(--skyBlue);
    border-radius: 10%;
  }
`;
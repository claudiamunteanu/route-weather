import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 5%;
  animation: animateMovieInfo 1s;
  display: inline-block;

  @keyframes animateMovieInfo {
    from {
      opacity: 0
    }
    to {
      opacity: 1;
    }
  }
`;

export const Content = styled.div`
  height: 100%;
  color: var(--white);
  max-width: var(--maxWidth);
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  width: 100%;
  padding: 20px;
  font-size: 14px;
  
  @media screen and (max-width: 768px) {
    display: block;
    max-height: none;
  }

  input{
    height: 25px;
    border: 1px solid var(--darkGrey);
    border-radius: 20px;
    margin: 0 20px 0 5px;
    padding: 10px;
  }
  
  .submitButton{
    width: 15%;
  }

  .suggestions{
    width: 65%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin-left: 32px;
  }

  .suggestion{
    cursor: pointer;
    width: 100%;
    color: var(--black);
    background-color: var(--white);
    padding: 0 0 0 10px;
  }

  .suggestion:hover{
    background-color: var(--grey);
  }
  
  .cityGroup{
    margin-top: 10px;
    width: 25%;
  }
  
  .graph{
    background-color: var(--white);
    padding-top: 10px;
    padding-right: 10px;
    margin: 10px 5px;
    display: inline-block;
  }
  
  .graphs{
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  
  .title{
    text-align: center;
    color: var(--white);
  }
  
  .averageTable{
    color: var(--black)
  }
  
  .categories-list{
    padding: 0;
  }

  .categories-list-item{
    display: flex;
    flex-direction: row;
    align-items: center;
    
    input{
      margin-right: 0;
      height: 13px;
      width: 13px;
    }
  }
`
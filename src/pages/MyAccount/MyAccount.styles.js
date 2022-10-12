import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 5%;
  animation: animateMovieInfo 1s;
  display: inline-block;

  @keyframes animateMovieInfo {
    from {
      opacity:0
    }
    to {
      opacity: 1;
    }
  }
`;

export const Content = styled.div`
  height: 100%;
  color: var(--darkGrey);
  max-width: var(--maxWidth);
  margin: 0 auto;
  background: rgba(0,0,0,0.4);
  border-radius: 20px;
  width: 100%;
  padding: 20px;

  @media screen and (max-width: 768px){
    display: block;
    max-height: none;
  }

  button{
    width: 18%;
    margin-bottom: 0;
  }
  
  .undoRedo-group{
    display: flex;
    flex-direction: row;
    margin-bottom: 0;
    
    button{
      width: 2%;
      margin-right: 10px;
      margin-top: 5px;
      margin-bottom: 0;
    }
  }
`;
import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  padding: 5% 30%;
  animation: animateMovieInfo 1s;

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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--darkGrey);
  max-width: var(--maxWidth);
  margin: 0 auto;
  background: rgba(0,0,0,0.4);
  border-radius: 20px;
  width: 100%;
  padding: 20% 30%;
  font-size: 14px;
  

  @media screen and (max-width: 768px){
    display: block;
    max-height: none;
  }
  
  .subscribe-group{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: left;
    flex-direction: row;
    color: var(--white);
    
    input[type="checkbox"]{
      width: 20px;
      margin: 0 20px 0 0;
      cursor: pointer;
    }
  }
  
  .emailAddress{
    display: ${({subscribeVisibility}) => !subscribeVisibility ? 'none' : 'block'};
  }
  
  .startTime {
    display: ${({subscribeVisibility}) => !subscribeVisibility ? 'none' : 'flex'};
    width: 100%;
    flex-direction: column;
    color: var(--white);
    
    input {
      width: 50%;
      float: left;
    }
  }
  
  .suggestions{
    width: 100%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  
  .suggestion{
    cursor: pointer;
    width: 100%;
    background-color: var(--white);
    padding: 0 0 0 10px;
  }
  
  .suggestion:hover{
    background-color: var(--grey);
  }
  
  input{
    width: 100%;
    height: 25px;
    border: 1px solid var(--darkGrey);
    border-radius: 20px;
    margin: 10px 0;
    padding: 10px;
  }

  .error{
    color: red;
  }
  
  .mode-group{
    padding: 10px 0;

    /* HIDE RADIO */
    [type=radio] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* IMAGE STYLES */
    [type=radio] +  .icon{
      cursor: pointer;
      color: var(--white);
      height: 50px;
      width: 50px;
      padding: 10px;
      margin-right: 10px;
      border-radius: 5px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.45);
    }

    /* CHECKED STYLES */
    [type=radio]:checked + .icon {
      background-color: var(--maizeCrayola);
      color: var(--black);
    }
  }
  
  .frequency-group{
    width: 100%;
    margin: 10px 0;
    display: ${({subscribeVisibility}) => !subscribeVisibility ? 'none' : 'block'};
    color: white;
    .radio-button-group{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: left;
      margin: 0 0 5px 0;
      
      input{
        width: 20px;
        height: 20px;
        margin: 0;
        cursor: pointer;
      }
      
      label {
        margin: 0 0 0 20px;
      }
    }
  }
`;
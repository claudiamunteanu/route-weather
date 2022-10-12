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
  
  .routes{
    margin-top: 20px;
    font-size: 20px;
    background-color: var(--lapisLazuli);
    padding: 10px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
  }

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

  [type=radio] +  .description{
    cursor: pointer;
    color: var(--white);
  }
  

  /* CHECKED STYLES */
  [type=radio]:checked + .icon{
    background-color: var(--maizeCrayola);
    color: var(--black);
  }

  [type=radio]:checked + .description {
    background-color: var(--maizeCrayola);
    color: var(--black);
  }
  
  .buttonLink{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    margin: 0 30px;
    background: var(--darkGrey);
    width: 25%;
    min-width: 100px;
    height:45px;
    border-radius: 30px;
    color: var(--white);
    border: 0;
  }
  
  .buttons-group{
    width: 60%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;
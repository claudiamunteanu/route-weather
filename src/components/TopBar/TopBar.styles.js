import styled from 'styled-components'

export const Wrapper = styled.div`
  background-color: var(--prussianBlue);
  font-size: 15px;

  .link.active {
    background-color: var(--indigoDye);
  }

  .button {
    background-color: var(--indigoDye);
    font-size: 15px;
    border: none;
    height: 40px;
    width: 80px;

    :hover {
      background-color: var(--lapisLazuli);
    }
  }

  .username {
    color: var(--white);
  }

  .myAccountIcon {
    margin-left: 20px;
    margin-right: 20px;
    height: 30px;
    width: 30px;
    color: var(--grey);
  }

  .myAccountIcon:hover {
    color: var(--white);
  }

  .flag {
    height: 10px;
  }

  .flag-container {
    height: 15px;
    width: 20px;
    margin: 2px 5px;
    padding: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  #navbarSettingsDropdown {
    color: var(--grey);
  }

  .dropdown-menu {
    height: 50px;
    padding: 0;
    min-width: 30px !important;
    width: 30px !important;
    margin-left: auto;
    margin-right: auto;
    right: 0;
  }

  .dropdown-menu.show {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .dropdown-toggle::after {
    display: none;
  }
  
  .settings-dropdown .dropdown-menu.show {
    left: -250px;
  }

  .settings-dropdown .dropdown-menu {
    height: 120px;
    padding: 0;
    width: 300px !important;
    margin-left: auto;
    margin-right: auto;
    right: 0;

    .settings-options{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      padding: 0 10px;
      
      label{
        margin-right: 5px;
      }
      
      input{
        margin-right: 2px;
      }
    }
    
    .options {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
`;

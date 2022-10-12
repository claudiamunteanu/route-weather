import Logo from "../../images/logo.png"
import {Container, Nav, Navbar, Button, NavDropdown} from "react-bootstrap";
import {Wrapper} from './TopBar.styles'
import {Context} from "../../context";
import {useCallback, useContext, useEffect, useState} from "react";
import {BsPersonCircle} from 'react-icons/bs'
import {isPersistedLocalStorageState} from "../../helpers";
import {US, RO} from 'country-flag-icons/react/3x2'
import {IoSettingsSharp} from 'react-icons/io5'
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

const TopBar = ({
                    text,
                    language,
                    setLanguage,
                    temperature,
                    setTemperature,
                    precipitation,
                    setPrecipitation,
                    windSpeed,
                    setWindSpeed,
                    pressure,
                    setPressure
                }) => {
    const [user, setUser] = useContext(Context)
    const [flag, setFlag] = useState(<US className="flag"/>)

    let navigate = useNavigate()

    const getUserFromLocalStorage = useCallback(() => {
        setUser(isPersistedLocalStorageState('user'));
    }, [setUser])

    useEffect(() => {
        if (user === undefined || user === null)
            getUserFromLocalStorage()
    }, [getUserFromLocalStorage, user])

    const handleLogout = () => {
        localStorage.clear()
        window.location.reload(false);
        navigate('/')
    }

    useEffect(()=>{
        switch (language) {
            case 'english':
                setFlag(<US className="flag"/>); break;
            case 'romanian':
                setFlag(<RO className="flag"/>); break;
            default:
                setFlag(<US className="flag"/>); break;
        }
    }, [language])

    useEffect(()=>{
        sessionStorage.setItem('temperature', temperature)
    }, [temperature])

    useEffect(()=>{
        sessionStorage.setItem('precipitation', precipitation)
    }, [precipitation])

    useEffect(()=>{
        sessionStorage.setItem('windSpeed', windSpeed)
    }, [windSpeed])

    useEffect(()=>{
        sessionStorage.setItem('pressure', pressure)
    }, [pressure])

    return (
        <Wrapper>
            {text &&
                <Navbar className="navbar" variant="dark">
                    <Container className="container">
                        <Navbar.Brand className="nav-brand" href="/">
                            <img alt="logo" src={Logo} height="50"/>
                        </Navbar.Brand>
                        <Nav variant="pills" className="me-auto">
                            <Nav.Link className="link" href="/">{text?.topBar.route}</Nav.Link>
                            <Nav.Link className="link" href="/statistics" id="statistics-option">{text?.topBar.statistics}</Nav.Link>
                        </Nav>
                        {user ? (
                            <>
                                <Navbar.Text>
                                    {text?.topBar.signedInAs} <span className="username">{user.username}</span>
                                </Navbar.Text>
                                <Navbar.Brand href="/myAccount">
                                    <BsPersonCircle className="myAccountIcon"/>
                                </Navbar.Brand>
                                <Button className="button" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <Button className="button" href="/login" id="login-option">Login</Button>
                        )}
                        <NavDropdown title={flag} id="navbarLanguageDropdown" className="language-dropdown">
                            <NavDropdown.Item onClick={() => {setLanguage('english'); sessionStorage.setItem('language', 'english')}} className="flag-container">
                                <US className="flag"/>
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {setLanguage('romanian'); sessionStorage.setItem('language', 'romanian')}} className="flag-container">
                                <RO className="flag"/>
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title={<IoSettingsSharp/>} id="navbarSettingsDropdown" className="settings-dropdown">
                            <div className="settings-options">
                                <b>{text?.statistics.headers.temp}</b>
                                <div className='options'>
                                    <input type="radio" name="temperature" value='°C' onChange={e => setTemperature(e.currentTarget.value)}
                                           checked={temperature === '°C'} id="celsius"/>
                                    <label htmlFor="celsius">°C</label>
                                    <input type="radio" name="temperature" value='°F' onChange={e => setTemperature(e.currentTarget.value)}
                                           checked={temperature === '°F'} id="fahrenheit"/>
                                    <label htmlFor="fahrenheit">°F</label>
                                </div>
                            </div>
                            <div className="settings-options">
                                <b>{text?.statistics.headers.rain}</b>
                                <div className='options'>
                                    <input type="radio" name="precipitation" value='in' onChange={e => setPrecipitation(e.currentTarget.value)}
                                           checked={precipitation === 'in'} id="in"/>
                                    <label htmlFor="in">in</label>
                                    <input type="radio" name="precipitation" value='l/m^2' onChange={e => setPrecipitation(e.currentTarget.value)}
                                           checked={precipitation === 'l/m^2'} id="l/m^2"/>
                                    <label htmlFor="l/m^2">l/m<sup>2</sup></label>
                                    <input type="radio" name="precipitation" value='mm' onChange={e => setPrecipitation(e.currentTarget.value)}
                                           checked={precipitation === 'mm'} id="mm"/>
                                    <label htmlFor="mm">mm</label>
                                </div>
                            </div>
                            <div className="settings-options">
                                <b>{text?.statistics.headers.wind}</b>
                                <div className='options'>
                                    <input type="radio" name="windSpeed" value='m/s' onChange={e => setWindSpeed(e.currentTarget.value)}
                                           checked={windSpeed === 'm/s'} id="m/s"/>
                                    <label htmlFor="m/s">m/s</label>
                                    <input type="radio" name="windSpeed" value='km/h' onChange={e => setWindSpeed(e.currentTarget.value)}
                                           checked={windSpeed === 'km/h'} id="km/h"/>
                                    <label htmlFor="km/h">km/h</label>
                                    <input type="radio" name="windSpeed" value='mph' onChange={e => setWindSpeed(e.currentTarget.value)}
                                           checked={windSpeed === 'mph'} id="mph"/>
                                    <label htmlFor="mph">mph</label>
                                </div>
                            </div>
                            <div className="settings-options">
                                <b>{text?.statistics.headers.pressure}</b>
                                <div className='options'>
                                    <input type="radio" name="pressure" value='mb' onChange={e => setPressure(e.currentTarget.value)}
                                           checked={pressure === 'mb'} id="mb"/>
                                    <label htmlFor="mb">mb</label>
                                    <input type="radio" name="pressure" value='hPa' onChange={e => setPressure(e.currentTarget.value)}
                                           checked={pressure === 'hPa'} id="hPa"/>
                                    <label htmlFor="hPa">hPa</label>
                                    <input type="radio" name="pressure" value='inHg' onChange={e => setPressure(e.currentTarget.value)}
                                           checked={pressure === 'inHg'} id="inHg"/>
                                    <label htmlFor="inHg">inHg</label>
                                </div>
                            </div>
                        </NavDropdown>
                    </Container>
                </Navbar>
            }
        </Wrapper>
    );
};

TopBar.propTypes = {
    text: PropTypes.object,
    language: PropTypes.string,
    setLanguage: PropTypes.func,
    temperature: PropTypes.string,
    setTemperature: PropTypes.func,
    precipitation: PropTypes.string,
    setPrecipitation: PropTypes.func,
    windSpeed: PropTypes.string,
    setWindSpeed: PropTypes.func,
    pressure: PropTypes.string,
    setPressure: PropTypes.func
}

export default TopBar
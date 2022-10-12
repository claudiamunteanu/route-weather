import {useEffect, useState} from "react";
import {Content, Wrapper} from "./Home.styles";
import {dateToTimestamp, timestampToDateTime} from "../../helpers";
import {useNavigate} from "react-router-dom";
import {FaCarAlt, FaBicycle} from "react-icons/fa";
import {MdDirectionsTransit} from "react-icons/md";
import Button from "../../components/Button";
import {validateHomeForm} from "../../validators/FormValidators";
import {toast, ToastContainer} from "react-toastify";
import {useSuggestionsFetch} from "../../hooks/useSuggestionsFetch";
import PropTypes from "prop-types";

const Home = ({text}) => {
    const [startCity, setStartCity] = useState('');
    const [destCity, setDestCity] = useState('');
    const [startDate, setStartDate] = useState(Math.round(Date.now() / 1000));
    const [mode, setMode] = useState('driving')

    const [startCityIsSelected, setStartCityIsSelected] = useState(false)
    const [destCityIsSelected, setDestCityIsSelected] = useState(false)

    const [minDate, setMinDate] = useState(Math.round(Date.now() / 1000))
    const [maxDate, setMaxDate] = useState(Math.round(Date.now() / 1000))

    const [willSubscribe, setWillSubscribe] = useState(false)
    const [emailAddress, setEmailAddress] = useState('')
    const [startTime, setStartTime] = useState('');
    const [frequency, setFrequency] = useState(1)

    const startSuggestions = useSuggestionsFetch(startCity, text);
    const destSuggestions = useSuggestionsFetch(destCity, text);

    const handleInput = e => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;

        switch (name) {
            case 'startCity':
                setStartCity(value);
                startSuggestions.setShowSuggestions(true)
                setStartCityIsSelected(false)
                break;
            case 'destCity':
                setDestCity(value);
                destSuggestions.setShowSuggestions(true)
                setDestCityIsSelected(false)
                break;
            case 'startDate':
                setStartDate(dateToTimestamp(value));
                break;
            case 'mode':
                setMode(value);
                break;
            case 'subscribe':
                setWillSubscribe(prevState => !prevState);
                break;
            case 'emailAddress':
                setEmailAddress(value);
                break;
            case 'startTime':
                setStartTime(value);
                break;
            case 'frequency':
                setFrequency(parseInt(value));
                break;
            default:
                break;
        }
    };

    const handleSuggestion = (text, setCity, setShowSuggestion, setCityIsSelected) => {
        setCity(text)
        setShowSuggestion(false)
        setCityIsSelected(true)
    }

    let navigate = useNavigate()
    const routeChange = () => {
        let path = `/route?startCity=` + encodeURIComponent(startCity) + `&destCity=` + encodeURIComponent(destCity) + `&startDate=` + encodeURIComponent(startDate) + `&mode=` + encodeURIComponent(mode);
        if (willSubscribe)
            path = path + `&emailAddress=` + encodeURIComponent(emailAddress) + `&startTime=` + encodeURIComponent(startTime) + `&frequency=${frequency}`
        navigate(path)
    }

    const sendForm = () => {
        const result = validateHomeForm(startCity, destCity, willSubscribe, emailAddress, startTime, text);
        if (result.error) {
            toast.error(result.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            routeChange()
        }
    }

    useEffect(() => {
        const numberOfDaysToAdd = 3;
        const secondsToAdd = numberOfDaysToAdd * 24 * 60 * 60;
        setMaxDate(minDate + secondsToAdd)
    }, [minDate])



    return (
        <>
            <Wrapper>{
                text &&
                <Content subscribeVisibility={willSubscribe}>
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    <input
                        type='text'
                        value={startCity}
                        name='startCity'
                        onChange={handleInput}
                        placeholder={text.home.startingCityPrompt}
                    />
                    <div className="suggestions">
                        {startSuggestions.suggestions && startSuggestions.suggestions.map((suggestion, i) =>
                            <div className="suggestion"
                                 id={"startSuggestion-"+(i+1)}
                                 key={i}
                                 onClick={() => handleSuggestion(suggestion.terms[0].value, setStartCity, startSuggestions.setShowSuggestions, setStartCityIsSelected)}
                            >
                                {suggestion.description}
                            </div>
                        )}
                    </div>
                    <input
                        type='text'
                        value={destCity}
                        name='destCity'
                        onChange={handleInput}
                        placeholder={text.home.destinationCityPrompt}
                    />
                    <div className="suggestions">
                        {destSuggestions.suggestions && destSuggestions.suggestions.map((suggestion, i) =>
                            <div className="suggestion"
                                 key={i}
                                 id={"destSuggestion-"+(i+1)}
                                 onClick={() => handleSuggestion(suggestion.terms[0].value, setDestCity, destSuggestions.setShowSuggestions, setDestCityIsSelected)}
                            >
                                {suggestion.description}
                            </div>
                        )}
                    </div>

                    {minDate && maxDate && <input
                        type='datetime-local'
                        value={timestampToDateTime(startDate)}
                        name='startDate'
                        onChange={handleInput}
                        placeholder="Start date"
                        min={timestampToDateTime(minDate)}
                        max={timestampToDateTime(maxDate)}
                    />}
                    <div className="mode-group">
                        <label>
                            <input type="radio" name="mode" value="driving" onChange={handleInput}
                                   checked={mode === 'driving'}/>
                            <FaCarAlt className="icon"/>
                        </label>
                        <label>
                            <input type="radio" name="mode" value="bicycling" onChange={handleInput}
                                   checked={mode === 'bicycling'}/>
                            <FaBicycle className="icon"/>
                        </label>
                        <label>
                            <input type="radio" name="mode" value="transit" onChange={handleInput}
                                   checked={mode === 'transit'}/>
                            <MdDirectionsTransit className="icon"/>
                        </label>
                    </div>
                    <div className="subscribe-group">
                        <input type="checkbox" id="subscribe" name="subscribe" value="subscribe"
                               onChange={handleInput}/>
                        <label htmlFor="subscribe"> {text.home.subscribe}</label>
                    </div>
                    <input
                        type='email'
                        value={emailAddress}
                        name='emailAddress'
                        onChange={handleInput}
                        placeholder={text.home.emailAddressPrompt}
                        className="emailAddress"
                    />
                    <div className="startTime">
                        {text.home.startingTimePrompt}:
                        <input
                            type='time'
                            value={startTime}
                            name='startTime'
                            onChange={handleInput}
                            placeholder={text.home.startingTimePrompt}
                        />
                    </div>
                    <div className="frequency-group">
                        {text.home.notificationFrequency}
                        <div className="radio-button-group">
                            <input type="radio" name="frequency" value={1} onChange={handleInput}
                                   checked={frequency === 1} id="one_day"/>
                            <label htmlFor="one_day">1 {text.home.day}</label>
                        </div>
                        <div className="radio-button-group">
                            <input type="radio" name="frequency" value={3} onChange={handleInput}
                                   checked={frequency === 3} id="three_days"/>
                            <label htmlFor="three_days">3 {text.home.days}</label>
                        </div>
                        <div className="radio-button-group">
                            <input type="radio" name="frequency" value={5} onChange={handleInput}
                                   checked={frequency === 5} id="five_days"/>
                            <label htmlFor="five_days">5 {text.home.days}</label>
                        </div>
                        <div className="radio-button-group">
                            <input type="radio" name="frequency" value={7} onChange={handleInput}
                                   checked={frequency === 7} id="seven_days"/>
                            <label htmlFor="seven_days">7 {text.home.days}</label>
                        </div>
                    </div>
                    <Button text={text.home.submit} callback={sendForm} name="submitButton" isEnabled={startCityIsSelected && destCityIsSelected}/>
                </Content>
            }
            </Wrapper>
        </>
    )
}

Home.propTypes = {
    text: PropTypes.object
}

export default Home;
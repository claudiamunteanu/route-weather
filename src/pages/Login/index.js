import {Wrapper, Content} from './Login.styles'
import {useContext, useState} from "react";
import {APIProxy} from "../../apis/APIProxy";
import {isPersistedLocalStorageState} from "../../helpers";
import {Link, useNavigate} from "react-router-dom";
import {validateLoginForm} from "../../validators/FormValidators";
import {toast, ToastContainer} from "react-toastify";
import Button from "../../components/Button";
import {Context} from "../../context";
import Spinner from "../../components/Spinner";
import PropTypes from "prop-types";

const Login = ({text}) => {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const [_user, setUser] = useContext(Context);

    const [loading, setLoading] = useState(false)

    const apiProxy = APIProxy.getInstance()


    const handleInput = e => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;

        switch (name) {
            case 'emailAddress':
                setEmailAddress(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    let navigate = useNavigate()

    const showErrorToast = (message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const handleSubmit = async () => {
        setLoading(true)
        const result = validateLoginForm(emailAddress, password, text);
        if(result.error) {
            setLoading(false)
            showErrorToast(result.message)
            return;
        }
        const language = sessionStorage.getItem("language")
        const loginResult = await apiProxy.login(emailAddress, password, language);
        if(loginResult.error){
            setLoading(false)
            showErrorToast(loginResult.message)
            return;
        }
        const sessionState = isPersistedLocalStorageState('user')
        if(sessionState){
            setUser({sessionUser: sessionState, emailAddress: emailAddress, username: loginResult.data.username})
            setLoading(false)
            navigate('/myAccount')
        }
        setLoading(false)
    }

    document.title = "Login"

    return (
            <Wrapper>
                <Content>
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
                    {loading && <Spinner/>}
                    <input
                        type='email'
                        value={emailAddress}
                        name='emailAddress'
                        onChange={handleInput}
                        placeholder={text?.login.emailAddress}
                    />
                    <input
                        type='password'
                        value={password}
                        name='password'
                        onChange={handleInput}
                        placeholder={text?.login.password}
                    />
                    <Button text={text?.login.submit} name="submitButton" callback={handleSubmit} isEnabled={true} />
                    <Link to='/newAccount' > {text?.login.newAccount} </Link>
            </Content>
        </Wrapper>
    )
}

Login.propTypes = {
    text: PropTypes.object
}

export default Login
import {Wrapper, Content} from './NewAccount.styles'
import {useState} from "react";
import {APIProxy} from "../../apis/APIProxy";
import {Link} from "react-router-dom";
import {validateNewAccountForm} from "../../validators/FormValidators";
import {toast, ToastContainer} from "react-toastify";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import PropTypes from "prop-types";

const NewAccount = ({text}) => {
    const [emailAddress, setEmailAddress] = useState('');
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false)

    const apiProxy = APIProxy.getInstance()


    const handleInput = e => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;

        switch (name) {
            case 'emailAddress':
                setEmailAddress(value);
                break;
            case 'username':
                setUsername(value)
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    };

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

    const showSuccessToast = (message) => {
        toast.success(message, {
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
        const result = validateNewAccountForm(emailAddress, username, password, confirmPassword, text);
        if(result.error) {
            setLoading(false)
            showErrorToast(result.message)
            return;
        }
        const language = sessionStorage.getItem("language")
        const newAcccountResult = await apiProxy.newUser(emailAddress, username, password, text, language);
        if(newAcccountResult.error){
            showErrorToast(newAcccountResult.message)
        } else {
            setEmailAddress('')
            setUsername('')
            setPassword('')
            setConfirmPassword('')
            showSuccessToast(newAcccountResult.message)
        }
        setLoading(false)
    }

    document.title = "Create Account"

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
                        placeholder={text?.newAccount.emailAddress}
                    />
                    <input
                        type='text'
                        value={username}
                        name='username'
                        onChange={handleInput}
                        placeholder={text?.newAccount.username}
                    />
                    <input
                        type='password'
                        value={password}
                        name='password'
                        onChange={handleInput}
                        placeholder={text?.newAccount.password}
                    />
                    <input
                        type='password'
                        value={confirmPassword}
                        name='confirmPassword'
                        onChange={handleInput}
                        placeholder={text?.newAccount.confirmPassword}
                    />
                    <Button text={text?.newAccount.submit} callback={handleSubmit} isEnabled={true} />
                    <Link to='/login' > {text?.newAccount.login} </Link>
            </Content>
        </Wrapper>
    )
}

NewAccount.propTypes = {
    text: PropTypes.object
}

export default NewAccount
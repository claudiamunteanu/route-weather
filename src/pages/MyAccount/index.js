import {Content, Wrapper} from "./MyAccount.styles";
import {useCallback, useEffect, useState} from "react";
import {isPersistedLocalStorageState} from "../../helpers";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import Table from "../../components/Table";
import {APIProxy} from "../../apis/APIProxy";
import Button from "../../components/Button";
import FormModal from "../../components/Modals/FormModal";
import Spinner from "../../components/Spinner";
import {useUserDrivingTipsFetch} from "../../hooks/useUserDrivingTipsFetch";
import {validateDrivingTip} from "../../validators/FormValidators";
import PropTypes from "prop-types";

const MyAccount = ({text}) => {
    const navigate = useNavigate()
    const [user, setUser] = useState('')

    useEffect(()=>{
        console.log('Checking if user is logged in')
        const sessionUser = isPersistedLocalStorageState('user')
        if(!sessionUser){
            navigate('/')
        } else {
            setUser(sessionUser)
        }
    },[navigate])

    const [columns, setColumns] = useState([]);

    const {state, loading, errorNotification, setLoadAgain} = useUserDrivingTipsFetch(user?.username, text);
    
    const apiProxy = APIProxy.getInstance()
    
    const showErrorToast = useCallback((message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }, [])

    const showSuccessToast = useCallback((message) => {
        toast.success(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }, [])
    
    useEffect(()=>{
        if(errorNotification.isError){
            showErrorToast(errorNotification.message)
        }
    }, [errorNotification.isError, errorNotification.message, showErrorToast])

    const deleteDrivingTip = useCallback(async (drivingTip) => {
        const language = sessionStorage.getItem("language")
        const result = await apiProxy.deleteUserDrivingTip(drivingTip.id, language)
        console.log(result)
        if(result.error){
            showErrorToast(result.message)
        } else {
            showSuccessToast("Driving tip deleted successfully!")
            setLoadAgain(true)
        }
    }, [apiProxy, setLoadAgain, showErrorToast, showSuccessToast])

    const addDrivingTip = async (drivingTip) => {
        const result = validateDrivingTip(drivingTip.text, drivingTip.categories, text);
        if(result.error) {
            showErrorToast(result.message)
            return;
        }
        const addResult = await apiProxy.saveUserDrivingTip(drivingTip, drivingTip.username, text)
        if(addResult.error){
            showErrorToast(addResult.message)
        } else {
            showSuccessToast("Driving tip saved successfully!")
            setLoadAgain(true)
        }
    }

    const modifyDrivingTip = useCallback(async (drivingTip) => {
        const result = validateDrivingTip(drivingTip.text, drivingTip.categories, text);
        if(result.error) {
            showErrorToast(result.message)
            return {error: true, data: drivingTip}
        }
        const language = sessionStorage.getItem("language")
        const updateResult = await apiProxy.updateUserDrivingTip(drivingTip, language)
        if(updateResult.error){
            showErrorToast(updateResult.message)
            return {error: true, data: drivingTip}
        } else {
            showSuccessToast("Driving tip updated successfully!")
            setLoadAgain(true)
            return {error: false, data: updateResult.data}
        }
    }, [apiProxy, setLoadAgain, showErrorToast, showSuccessToast, text])

    const undoDrivingTip = async () => {
        const language = sessionStorage.getItem("language")
        const result = await apiProxy.undoDrivingTip(text, language)
        if(result.error){
            showErrorToast(result.message)
        } else {
            showSuccessToast(result.message)
            setLoadAgain(true)
        }
    }

    const redoDrivingTip = async () => {
        const language = sessionStorage.getItem("language")
        const result = await apiProxy.redoDrivingTip(text, language)
        if(result.error){
            showErrorToast(result.message)
        } else {
            showSuccessToast(result.message)
            setLoadAgain(true)
        }
    }

    useEffect(() => {
        if(text !==null){
            setColumns( [
                {heading: text?.myAccount.headers.number, value: 'index'},
                {heading: 'Text', value: 'text'},
                {heading: text?.myAccount.headers.categories, value: 'categories'},
                {heading: `${text?.myAccount.updateDrivingTip.button}Button`, value: modifyDrivingTip},
                {heading: `${text?.myAccount.deleteDrivingTip.button}Button`, value: deleteDrivingTip},
            ])
        }
    }, [deleteDrivingTip, modifyDrivingTip, text])

    document.title = "My Account"
    
    return (
        <Wrapper>
            {text &&
                <Content name="content">
                    <ToastContainer
                        name="error-toast"
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
                    <h1>{text?.myAccount.title}</h1>
                    <div className="undoRedo-group">
                        <Button text="Undo" isEnabled={true} callback={undoDrivingTip}/>
                        <Button text="Redo" isEnabled={true} callback={redoDrivingTip}/>
                    </div>
                    {user?.username && <FormModal text={text} buttonName="newDrivingTipButton" triggerText={text?.myAccount.newDrivingTip.button}
                                                       modalTitle={text?.myAccount.newDrivingTip.title}
                                                       callbackText={text?.myAccount.newDrivingTip.save}
                                                       callback={addDrivingTip} updateDrivingTip={false} drivingTip={{
                        id: 0,
                        text: '',
                        categories: [],
                        username: user.username
                    }}/>}
                    {loading && <Spinner/>}
                    <Table data={state.drivingTips} column={columns} text={text}/>
                </Content>
            }
        </Wrapper>
    )
}

MyAccount.propTypes = {
    text: PropTypes.object
}

export default MyAccount
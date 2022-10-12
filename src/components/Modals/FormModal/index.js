import React, {useState} from 'react';
import Popup from 'reactjs-popup';
import './FormModal.styles.css'
import {weatherCategories} from "../../../helpers";
import PropTypes from "prop-types";

const contentStyle = {};
const overlayStyle = {background: 'rgba(0,0,0,0.5)'};
const arrowStyle = {color: '#000'};

const FormModal = ({text, buttonName, triggerText, modalTitle, callbackText, callback, drivingTip, updateDrivingTip}) => {
    const [open, setOpen] = useState(false);
    const [drivingTipText, setDrivingTipText] = useState(drivingTip.text)
    const [drivingTipCategories, setDrivingTipCategories] = useState(drivingTip.categories)
    const [isError, setIsError] = useState(false)

    const handleInput = e => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;

        switch (name) {
            case 'drivingTipText':
                setDrivingTipText(value);
                break;
            default:
                break;
        }
    };

    const initializeCheckedState = () => {
        return weatherCategories.map(item => {
            if (drivingTip?.categories.includes(item)) {
                return {name: item, isChecked: true}
            } else {
                return {name: item, isChecked: false}
            }
        })
    }

    const [checkedState, setCheckedState] = useState(() => {
            return initializeCheckedState()
        }
    );

    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? {name: item.name, isChecked: !item.isChecked} : item
        );
        setCheckedState(updatedCheckedState);

        const updatedCategories = updatedCheckedState.filter(item => item.isChecked === true).map(item => item.name);
        setDrivingTipCategories(updatedCategories)
    };

    const restartModal = () => {
        setCheckedState(initializeCheckedState());
        setDrivingTipCategories(drivingTip.categories)
        setDrivingTipText(drivingTip.text)
    }

    return (
        <Popup
            trigger={<button name={buttonName} className="trigger-button" onClick={() => setOpen(true)}>{triggerText}</button>}
            open={open}
            modal
            nested
            contentStyle={contentStyle}
            overlayStyle={overlayStyle}
            arrowStyle={arrowStyle}
            closeOnDocumentClick={true}
            onClose={() => { restartModal(); setOpen(false)}}
        >
            {close => (
                <div className="modal-content">
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="header"> {modalTitle} </div>
                    <div className="content">
                        <div className="promptText">
                            Text:
                        </div>
                        <textarea
                            value={drivingTipText}
                            name='drivingTipText'
                            onChange={handleInput}
                            className="textArea"
                            maxLength='255'
                        />
                        <ul className="categories-list">
                            {checkedState && checkedState.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <div className="categories-list-item">
                                            <input
                                                type="checkbox"
                                                id={`checkbox-${index}`}
                                                name={item.name}
                                                value={item.name}
                                                checked={item.isChecked}
                                                onChange={() => handleOnChange(index)}
                                            />
                                            <label
                                                htmlFor={`checkbox-${index}`}>{text?.weatherTypes[item.name.toLowerCase()]}</label>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="actions">
                        <button
                            name="submitButton"
                            className="modal-button"
                            onClick={ async () => {
                                let copiedTip = JSON.parse(JSON.stringify(drivingTip));
                                copiedTip.text = drivingTipText
                                copiedTip.categories = drivingTipCategories
                                let result = await callback(copiedTip)
                                if(updateDrivingTip && !result.error){
                                    console.log(result)
                                    drivingTip = result.data
                                }
                                console.log(drivingTip)
                                close()
                            }}
                        >
                            {callbackText}
                        </button>
                        <button
                            className="modal-button"
                            onClick={close}
                        >
                            {text?.myAccount.newDrivingTip.close}
                        </button>
                    </div>
                </div>
            )}
        </Popup>
    )
}

FormModal.propTypes = {
    text: PropTypes.object,
    buttonName: PropTypes.string,
    triggerText: PropTypes.string,
    modalTitle: PropTypes.string,
    callbackText: PropTypes.string,
    callback: PropTypes.func,
    drivingTip: PropTypes.object,
    updateDrivingTip: PropTypes.bool
}

export default FormModal
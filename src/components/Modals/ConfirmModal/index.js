import React, {useState} from 'react';
import Popup from 'reactjs-popup';
import './ConfirmModal.styles.css'
import PropTypes from "prop-types";

const contentStyle = {};
const overlayStyle = {background: 'rgba(0,0,0,0.5)'};
const arrowStyle = {color: '#000'};

const ConfirmModal = ({triggerText, modalTitle, modalText, text, callback}) => {
    const [open, setOpen] = useState(false);
    return (
        <Popup
            trigger={<button className="trigger-button" onClick={() => setOpen(true)}>{triggerText}</button>}
            open={open}
            modal
            nested
            contentStyle={contentStyle}
            overlayStyle={overlayStyle}
            arrowStyle={arrowStyle}
            closeOnDocumentClick={true}
            onClose={() => setOpen(false)}
        >
            {close => (
                <div className="modal-content">
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="header"> {modalTitle} </div>
                    <div className="content">
                        {' '}
                        {modalText}
                    </div>
                    <div className="actions">
                        <button
                            className="modal-button"
                            onClick={ () => {
                                callback()
                                close()
                            }}
                        >
                            {text?.myAccount.deleteDrivingTip.yes}
                        </button>
                        <button
                            className="modal-button"
                            onClick={() => {
                                console.log('modal closed ');
                                close();
                            }}
                        >
                            {text?.myAccount.deleteDrivingTip.no}
                        </button>
                    </div>
                </div>
            )}
        </Popup>
    )
}

ConfirmModal.propTypes = {
    triggerText: PropTypes.string,
    modalTitle: PropTypes.string,
    modalText: PropTypes.string,
    text: PropTypes.object,
    callback: PropTypes.func
}

export default ConfirmModal
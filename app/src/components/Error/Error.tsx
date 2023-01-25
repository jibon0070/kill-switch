import {useEffect, useState} from "react";
import ErrorService from "../../services/error.service";
import "./error.scss";

export default function Error() {
    const [message, set_message] = useState("");
    useEffect(() => {
        ErrorService.error.subscribe(m => {
            set_message(m);
        });
    }, []);
    return message !== "" ? <div id="error">
        <div className={'container'}>
            <div className="card col-md-6">
                <div className="title">Error</div>
                <div className="body">
                    <div className="content">
                        {message}
                    </div>
                    <hr/>
                    <div className="align-right mt-3">
                        <button className={'btn bg-primary'} onClick={() => set_message("")}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div> : <></>
};
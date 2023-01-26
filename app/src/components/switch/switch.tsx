import "./switch.scss"
import React from "react";

export default function Switch({
                                   checked = false,
                                   onChange
                               }: { checked?: boolean, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return <div className={'switch'}>
        <label><input type="checkbox" checked={checked} onChange={onChange}/>
            <span className={'slider'}>
                <span className="slide"/>
            </span>
        </label>
    </div>;
};
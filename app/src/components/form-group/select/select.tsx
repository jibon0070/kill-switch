import React, {useEffect, useState} from "react";
import {FormControl} from "../ReactFormGroup";
import './select.scss';

type props_type = {
    options: { label: string, value: string }[];
    control: FormControl;
    on_change?: (value: string) => void
    label:string
};
export default function Select({control, options, on_change: parent_on_change, label}: props_type) {
    const [value, set_value] = useState(control.value);

    const [show_option, set_show_option] = useState(false);
    const [selected_index, set_selected_index] = useState(0);

    function on_change(value: string, e?: any) {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        control.set_value(value);
        parent_on_change?.(value);
        set_show_option(false);
    }

    useEffect(() => {
        control.on_set_value(value => {
            set_value(value);
        });
    });

    return <div
        onKeyDown={e => {
            if (show_option) {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    set_selected_index(prev => {
                        return prev <= 0 ? 0 : prev - 1
                    });
                }
                else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    set_selected_index(prev => {
                        return prev >= options.length ? options.length - 1 : prev + 1
                    });
                }
                else if (e.key === 'Enter') {
                    e.preventDefault();
                    on_change(options[selected_index].value)
                }
            }
        }}
        onClick={() => set_show_option(true)}
        id={'select'}
        className={'form-control'}
        tabIndex={0}
        onFocus={() => set_show_option(true)}
        onBlur={() => set_show_option(false)}
    >
        <div className="value">{options?.filter(option => option.value == value)?.[0]?.label ?? `Select ${label}`}</div>
        <ul className={`options${show_option ? ' show' : ''}`}>
            <li className={'option'} onClick={() => on_change('')}>Select {label}</li>
            {options?.map((option, i) => {
                return <li onMouseMove={() => set_selected_index(i)} key={option.value}
                           className={`option${option.value == value ? ' active' : ''}${selected_index === i ? ' highlighted' : ''}`}
                           onClick={(e) => on_change(option.value, e)}>{option.label}</li>
            })}
        </ul>
    </div>;
};
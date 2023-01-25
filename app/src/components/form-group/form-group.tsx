import React, {useEffect, useRef, useState} from "react";
import {FormControl} from "./ReactFormGroup";
import Select from "./select/select";

export default function FormGroup({
                                      label,
                                      type = 'text',
                                      className = '',
                                      control,
                                      clicked,
                                      options,
                                      on_change,
                                      accept,
                                      multiple,
                                      disabled
                                  }: {
    label: string;
    type?: 'text' | 'password' | 'checkbox' | 'file' | "select" | 'textarea' | 'date' | 'number',
    className?: string,
    control: FormControl,
    clicked: boolean,
    options?: {
        label: string,
        value: string
    }[],
    on_change?: (e: React.ChangeEvent | string) => void,
    accept?: string,
    multiple?: boolean,
    disabled?: boolean
}) {
    const ref = useRef<any>(null);
    const [touched, set_touched] = useState(false);
    const [dirty, set_dirty] = useState(false);
    const [valid, set_valid] = useState(false);
    const [errors, set_errors] = useState<{ [key: string]: any }>({});
    const [checked, set_checked] = useState(false);
    const [hidden, set_hidden] = useState(true);


    useEffect(() => {
        control?.set_ref_and_state?.(ref, {set_touched, set_dirty, set_valid, set_errors, set_checked})
        control?.use_effect();
        if (type === 'checkbox') {
            set_checked(typeof control.value === 'boolean' ? control.value : control.value === 'true');
        }
    }, []);
    return (
        <div
            className={`${className ?? ''} ${(!valid && (dirty || touched)) || (!valid && clicked) ? 'is-invalid ' : ''} form-group`}
        >
            {(['file', 'date', 'select'].includes(type) || ref?.current?.value) && type !== 'checkbox' ?
                <label htmlFor={control.id}>{label}</label> : null}
            {type === 'select' ?
                <>
                    <select style={{display: 'none'}}
                            disabled={disabled}
                            id={control.id}
                            ref={ref}
                        // onChange={e => {
                        //     control.on_change(e)
                        //     on_change?.(e);
                        // }}
                            onBlur={control.on_blur}
                    >
                        <option value="">Select {label}</option>
                        {options?.map((row, i) => {
                            return <option key={i} value={row.value}>{row.label}</option>
                        })}
                    </select>
                    <Select
                        label={label}
                        control={control}
                        options={options!}
                        on_change={on_change}
                    />
                </> :
                type === 'textarea' ?
                    <textarea
                        disabled={disabled}
                        id={control.id}
                        ref={ref}
                        placeholder={label}
                        onChange={e => {
                            control.on_change(e)
                        }}
                        className={'form-control'}
                        onBlur={control.on_blur}
                    ></textarea> :
                    type === 'checkbox' ?
                        <>
                            <input disabled={disabled} ref={ref} onChange={e => {
                                e.target.value = (!checked).toString();
                                control.on_change?.(e);
                                on_change?.(e);
                                set_checked((checked) => {
                                    return !checked;
                                });
                            }} checked={checked} onBlur={() => control.on_blur?.()}
                                   type="checkbox" id={control.id}/><label
                            htmlFor={control.id}
                            style={{userSelect: 'none'}}>{label}</label>
                        </> :
                        <div className={'control-group'}>
                            <input disabled={disabled} id={control.id}
                                   autoComplete="new-password"
                                   ref={ref}
                                   type={type === 'password' ? `${hidden ? 'password' : 'text'}` : (type ?? 'text')}
                                   placeholder={label}
                                   onChange={e => {
                                       control.on_change(e);
                                       on_change?.(e);
                                   }}
                                   className={'form-control'}
                                   onBlur={() => control.on_blur?.()}
                                   accept={accept} multiple={multiple}
                                   style={{
                                       borderTopRightRadius: type === 'password' ? '0' : '3px',
                                       borderBottomRightRadius: type === 'password' ? '0' : '3px',
                                   }}
                            />
                            {type === 'password' ?
                                <span className={'icon'} onClick={() => set_hidden(prev => !prev)}>
                                    {hidden ?
                                        <i className="fa-solid fa-eye"></i> :
                                        <i className="fa-solid fa-eye-slash"></i>}
                                </span> :
                                null}
                        </div>
            }
            {(!valid && (dirty || touched)) || (!valid && clicked) ?
                <div className="invalid-feedback">
                    {Object.keys(errors).includes('required') ?
                        <span>{label} is required.</span> : null}
                    {Object.keys(errors).includes('username') ?
                        <span>{errors.username}</span> : null}
                    {Object.keys(errors).includes('password') ?
                        <span>{errors.password}</span> : null}
                    {Object.keys(errors).includes('phone') ?
                        <span>{errors.phone}</span> : null}
                    {Object.keys(errors).includes('uniq') ?
                        <span>{errors.uniq}</span> : null}
                    {Object.keys(errors).includes('email') ?
                        <span>{errors.email}</span> : null}
                    {Object.keys(errors).includes('min') ?
                        <span>{errors.min}</span> : null}
                </div> : null}
            {/*error : {JSON.stringify(errors)} <br/>*/}
            {/*valid : {valid.toString()} <br/>*/}
            {/*dirty : {dirty.toString()} <br/>*/}
            {/*touched : {touched.toString()} <br/>*/}
            {/*clicked : {clicked.toString()}*/}
        </div>
    );
};
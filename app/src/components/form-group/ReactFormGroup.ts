import React from "react";

export type value_type = string | number | boolean | null;
export type error_type = { [key: string]: string };
type validator_type = (value: value_type) => error_type | null;
type async_validator_type = (value: value_type) => Promise<error_type | null>
type states_type = { [key: string]: Function } | null;
type control_type = {
    value: value_type,
    validators?: validator_type[] | validator_type,
    async_validators?: async_validator_type[] | async_validator_type;
};
export default class ReactiveForm {
    private fields!: { [key: string]: FormControl };
    private initial: { [key: string]: control_type };

    get valid(): boolean {
        const valids = [];
        for (let field in this.fields) {
            valids.push(this.fields[field].valid);
        }
        return !valids.includes(false);
    }

    constructor(form_group: { [key: string]: control_type }) {
        this.initial = form_group
        this.set_fields(form_group)

    }

    get value(): { [key: string]: any } {
        const value: { [key: string]: string | number | boolean | null } = {};
        for (let field in this.fields) {
            value[field] = this.fields[field].value;
        }
        return value
    }

    get(name: string): FormControl {
        return this.fields[name];
    }

    patch(data: { [key: string]: any }) {
        for (let key in data) {
            if (Object.keys(this.fields).includes(key)) {
                this.fields[key].set_value(data[key]);
            }
        }
    }

    reset() {
        for (let key in this.fields) {
            this.get(key).reset();
        }
    }

    private set_fields(control: { [key: string]: control_type }) {
        const clone: { [key: string]: FormControl } = {};
        for (let key in control) {
            clone[key] = new FormControl(control[key])
        }
        this.fields = clone;
    }
}

export class FormControl {
    value!: value_type;
    errors: error_type = {};
    private validators: validator_type[] = [];
    dirty: boolean = false;
    touched: boolean = false;
    valid: boolean = false;
    private ref: any = null;
    private states: states_type = null;
    private async_validators: async_validator_type[] = [];
    id: string = '';
    private readonly init_value: value_type = '';
    private set_value_callbacks: ((value: value_type) => void)[] = [];

    constructor(control: control_type) {
        this.id = `${new Date().getTime()}_${Math.round(Math.random() * 1000000)}`;
        if (!control.validators) control.validators = [];
        if (!control.async_validators) control.async_validators = [];
        if (control.validators instanceof Array) {
            this.validators = control.validators;
        }
        else {
            this.validators = [control.validators];
        }
        if (control.async_validators instanceof Array) {
            this.async_validators = control.async_validators;
        }
        else {
            this.async_validators = [control.async_validators];
        }
        this.init_value = control.value;
        this.set_value(control.value);
    }

    reset() {
        this.errors = {};
        this.dirty = false;
        this.touched = false;
        this.valid = false;
        this.set_value(this.init_value);
    }

    use_effect() {
        this.set_value(this.value);
    }

    private async validate() {
        let errors: error_type = {}
        for (let validator of this.validators) {
            const error = validator(this.value)
            if (error) errors = {...errors, ...error}
        }
        for (let validator of this.async_validators) {
            const error = await validator(this.value)
            if (error) errors = {...errors, ...error}
        }
        this.errors = errors;
        this.valid = !Object.keys(errors).length;
        this.states?.set_valid?.(this.valid);
        this.states?.set_errors?.(errors);
    }


    on_change = (e: React.ChangeEvent) => {
        this.dirty = true;
        this.value = (e.target as HTMLInputElement).value;
        if (this.value === 'true' || this.value === 'false') {
            this.value = this.value === 'true';
        }
        // noinspection JSIgnoredPromiseFromCall
        this.validate();
        this.states?.set_dirty?.(true);
    }


    on_blur = () => {
        this.touched = true;
        this.states?.set_touched?.(true);
    };

    set_ref_and_state(ref: any, states: states_type) {
        this.ref = ref;
        this.states = states;
    }

    set_value(value: value_type) {
        this.value = value;
        this.validate().then(() => {
            if (this.ref?.current) {
                this.ref.current.value = value;
            }
        });
        for (let callback of this.set_value_callbacks) {
            callback(value);
        }
    }

    set_error(error: error_type) {
        this.errors = {...this.errors, ...error};
        this.valid = false;
        this.states?.set_errors(this.errors)
        this.states?.set_valid(false);
    }

    add_validator(validator: validator_type) {
        if (this.validators.indexOf(validator) === -1) this.validators.push(validator);
        // noinspection JSIgnoredPromiseFromCall
        this.validate();
    }

    set_validator(validators: validator_type | validator_type[] = []) {
        this.validators = [];
        if (validators instanceof Array) {
            for (let validator of validators) {
                this.add_validator(validator);
            }
        }
        else {
            this.add_validator(validators);
        }
    }

    remove_validator(validator: validator_type | null = null) {
        if (validator === null) {
            this.validators = [];
            // noinspection JSIgnoredPromiseFromCall
            this.validate();
        }
        else {
            const index = this.validators.indexOf(validator);
            if (index !== -1) {
                this.validators = this.validators.splice(index, 1);
                // noinspection JSIgnoredPromiseFromCall
                this.validate();
            }
        }
    }

    add_async_validator(validator: async_validator_type) {
        if (this.async_validators.indexOf(validator) === -1) this.async_validators.push(validator);
        // noinspection JSIgnoredPromiseFromCall
        this.validate();
    }

    set_async_validator(validators: async_validator_type | async_validator_type[] = []) {
        this.async_validators = [];
        if (validators instanceof Array) {
            for (let validator of validators) {
                this.add_async_validator(validator);
            }
        }
        else {
            this.add_async_validator(validators);
        }
    }

    remove_async_validator(validator: async_validator_type | null = null) {
        if (validator === null) {
            this.async_validators = [];
            // noinspection JSIgnoredPromiseFromCall
            this.validate();
        }
        else {
            const index = this.async_validators.indexOf(validator);
            if (index !== -1) {
                this.async_validators = this.async_validators.splice(index, 1);
                // noinspection JSIgnoredPromiseFromCall
                this.validate();
            }
        }
    }

    on_set_value(callback: (value: value_type) => void) {
        if (this.set_value_callbacks.indexOf(callback) === -1)
            this.set_value_callbacks.push(callback);
    }
}
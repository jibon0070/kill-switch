import Config from "../../config";
import Http from "../../http";

type value_type = string | number | boolean | null;
type return_type = { [key: string]: string } | null;
type async_return_type = Promise<return_type>;
type return_function_type = (value: value_type) => return_type;
type return_async_function_type = (value: value_type) => async_return_type

export default class Validators {
    static required_true(message: string): return_function_type {
        return (value) => {
            if (typeof value === 'boolean' && value) return null;
            return {username: message};
        }
    }

    static required(value: value_type): return_type {
        value = Validators.trim(value);
        if (value) return null;
        return {
            required: 'true'
        }
    }

    private static trim(value: string | number | boolean | null) {
        value = value?.toString() ?? null;
        if (value)
            value = value.trim();
        return value;
    }

    static email(value: value_type): return_type {
        value = Validators.trim(value);
        if (!value)
            return null;
        const containsSpace = /\s/;
        if (containsSpace.test(value)) return {email: "Email can't contain any space"};
        const validEmail = /^.+@.+\..+/;
        if (!validEmail.test(value)) return {email: "Not a valid email."};
        return null;
    }

    static username(value: value_type): return_type {
        value = Validators.trim(value);
        if (!value) return null;
        const containsCapitalLetter = /[A-Z]/;
        if (containsCapitalLetter.test(value)) return {username: "Username cannot contain capital letter"};
        const containsSpace = /\s/;
        if (containsSpace.test(value)) return {username: "Do not use spaces is username."};
        const dontStartsWithCharacter = /(^\W)/;
        if (dontStartsWithCharacter.test(value)) return {username: "Username must start with character."};
        const startsWithNumber = /^\d/;
        if (startsWithNumber.test(value)) return {username: "Username must not start with number."};
        const containsNumberInMiddle = /^[a-z.]+\d[a-z.]+/;
        if (containsNumberInMiddle.test(value)) return {username: "If you use number it be at the end."};
        const endsWithDot = /\.$/;
        if (endsWithDot.test(value)) return {username: "Username can't end with dot."};
        return null;
    }

    static password(minLength: number, maxLength: number, hard: boolean = true): return_function_type {
        return (value) => {
            value = Validators.trim(value);
            if (!value) return null;
            if (hard) {
                const containsCapitalLetter = /[A-Z]/;
                if (!containsCapitalLetter.test(value)) return {password: "Password must contain at least 1 capital letter."};
                const containsSmallLetter = /[a-z]/;
                if (!containsSmallLetter.test(value)) return {password: "Password must contain at least 1 small letter."};
                const containsNumber = /[0-9]/;
                if (!containsNumber.test(value)) return {password: "Password must contain at least 1 number."};
            }
            if (value.length < minLength) return {"password": `Password must be at least ${minLength} character long.`};
            if (value.length > maxLength) return {"password": `Password must be under ${maxLength} character long.`};
            return null;
        };
    }

    static phone(value: value_type): return_type {
        value = Validators.trim(value);
        if (!value) return null;
        const startsWith01 = /^01/;
        if (!startsWith01.test(value as string)) return {phone: "Phone number must starts with 01."};
        const notContainNumber = /[^0-9]/;
        if (notContainNumber.test(value as string)) return {phone: "Phone number must contain only number."};
        if (value?.length !== 11) return {phone: `Phone number must be 11 characters long. Current number is ${value?.length} characters long.`};
        return null;
    }

    static uniq(link: string, field: string, message: string, except: string[] = []): return_async_function_type {
        return (value) => {
            const ret = () => {
                return new Promise<null>((resolve) => {
                    resolve(null);
                });
            }
            if (!value) return ret();
            if (except.includes(value?.toString() ?? '')) return ret();
            return Http.post(Config.api + link, {value: value, field: field}).result.then((response) => {
                if (response === true) return null;
                return {uniq: message};
            });
        };
    }

    static min(number: number): return_function_type {
        return (value) => {
            value = Validators.trim(value);
            if (!value) return null;
            if (parseInt(value) < number) return {min: 'Value must be greater than or equal to ' + number};
            return null;
        };
    }

    static max(number: number): return_function_type {
        return (value) => {
            value = Validators.trim(value);
            if (!value) return null;
            if (parseInt(value) > number) return {max: 'Value must be less than or equal to ' + number};
            return null;
        }
    }

    static min_length(number: number): return_function_type {
        return (value) => {
            value = Validators.trim(value);
            if (!value) return null;
            if (value.length < number) return {min: 'Value must be greater than or equal to ' + number};
            return null;
        };
    }

    static max_length(number: number): return_function_type {
        return (value) => {
            value = Validators.trim(value);
            if (!value) return null;
            if (value.length > number) return {min: 'Value must be less than or equal to ' + number};
            return null;
        };
    }
}
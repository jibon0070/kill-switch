import React, {useEffect, useMemo, useState} from "react";
import FormGroup from "../../../components/form-group/form-group";
import ReactiveForm from "../../../components/form-group/ReactFormGroup";
import Validators from "../../../components/form-group/validators";
import {Link, useNavigate} from "react-router-dom";
import UsersService from "../../../services/users.service";
import Loading from "../../../loading/loading";
import Config from "../../../config";
import ErrorService from "../../../services/error.service";

export default function Register() {
    const [clicked, set_clicked] = useState(false);
    const data = useMemo(() => new ReactiveForm({
        username: {
            value: "",
            validators: [Validators.required, Validators.min_length(4), Validators.max_length(50), Validators.username],
            async_validators:[Validators.uniq("/users/uniq", "username", "Username already registered.")]
        },
        full_name: {value: "", validators: [Validators.required, Validators.min_length(4), Validators.max_length(50)]},
        email: {value: "", validators: [Validators.required, Validators.email], async_validators:[Validators.uniq("/users/uniq", "email", "Email already registered.")]},
        password: {value: "", validators: [Validators.required, Validators.password(8, 50)]},
    }), []);

    const [submitted, set_submitted] = useState(false);
    const [loading, set_loading] = useState(false);

    let navigate = useNavigate();
    useEffect(() => {
        if (!['visitor'].includes(UsersService.role)) navigate('/');
        else {
            document.title = "Register";
        }
    }, []);

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        set_clicked(true);
        if (data.valid && !submitted) {
            set_submitted(true);
            set_loading(true);
            UsersService.register(data.value).result.then(r => {
                if (r.success) {
                    localStorage.setItem(Config.token, r.token);
                    UsersService.$is_logged_in.emit(true);
                    navigate('/');
                }
                else if (r.input_error) {
                    data.get(r.input_error.name).set_error({username: r.input_error.message});
                    set_submitted(false);
                    set_loading(false);
                }
                else if (r.error) {
                    ErrorService.show(r.error);
                    set_submitted(false);
                    set_loading(false);
                }
            });
        }
    }

    return <div id="register">
        {loading ? <Loading/> : null}
        <div className="container align-center">
            <div className="card col-md-6">
                <div className="title">register</div>
                <div className="body">
                    <form onSubmit={e => submit(e)}>
                        <FormGroup label={"Username"} control={data.get("username")} clicked={clicked}/>
                        <FormGroup label={"Full Name"} control={data.get('full_name')} clicked={clicked}/>
                        <FormGroup label={"Email"} control={data.get("email")} clicked={clicked}/>
                        <FormGroup label={"Password"} control={data.get("password")} clicked={clicked}
                                   type={"password"}/>
                        <div className="align-right">
                            <Link to={"../login"} className={"btn bg-secondary"}>Login</Link>
                            <button type="submit" className="btn bg-primary">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
};
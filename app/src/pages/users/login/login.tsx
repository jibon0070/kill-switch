import FormGroup from "../../../components/form-group/form-group";
import React, {useEffect, useMemo, useState} from "react";
import ReactiveForm from "../../../components/form-group/ReactFormGroup";
import Validators from "../../../components/form-group/validators";
import {Link, useNavigate} from "react-router-dom";
import UsersService from "../../../services/users.service";
import Config from "../../../config";
import ErrorService from "../../../services/error.service";
import Loading from "../../../loading/loading";

export default function Login() {
    const data = useMemo(() => new ReactiveForm({
        username: {value: "", validators: [Validators.required]},
        password: {value: "", validators: [Validators.required]}
    }), [])
    let navigate = useNavigate();
    const [clicked, set_clicked] = useState(false);
    const [submitted, set_submitted] = useState(false);
    const [loading, set_loading] = useState(false);

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        set_clicked(true);
        if (data.valid && !submitted) {
            set_submitted(true);
            set_loading(true);
            UsersService.login(data.value).result.then(r => {
                if (r.success) {
                    localStorage.setItem(Config.token, r.token);
                    UsersService.$is_logged_in.emit(true);
                    navigate("/");
                }
                else if (r.input_error) {
                    data.get(r.input_error.name).set_error({username: r.input_error.message});
                    set_loading(false);
                    set_submitted(false);
                }
                else if (r.error) {
                    ErrorService.show(r.error);
                    set_loading(false);
                    set_submitted(false);
                }
            });
        }
    }

    useEffect(() => {
        if (!['visitor'].includes(UsersService.role)) navigate("/");
        else document.title = "Login";
    }, []);

    return <div id="login">
        {loading ? <Loading/> : null}
        <div className="container align-center">
            <div className="card col-md-6">
                <div className="title">Login</div>
                <div className="body">
                    <form onSubmit={e => submit(e)}>
                        <FormGroup label={"Username or Email"} control={data.get("username")} clicked={clicked}/>
                        <FormGroup type={'password'} label={"Password"} control={data.get("password")}
                                   clicked={clicked}/>
                        <div className="align-right">
                            <Link className={'btn bg-secondary'} to={'../register'}>Register</Link>
                            <button className={'btn bg-primary'}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
};
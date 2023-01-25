import {Link, useNavigate} from "react-router-dom";
import FormGroup from "../../../components/form-group/form-group";
import React, {useMemo, useState} from "react";
import ReactiveForm from "../../../components/form-group/ReactFormGroup";
import Validators from "../../../components/form-group/validators";
import HomeService from "../../../services/home.service"
import Loading from "../../../loading/loading";
import ErrorService from "../../../services/error.service";

export default function New() {
    const data = useMemo(() => new ReactiveForm({
        link: {value: "", validators: Validators.required}
    }), []);
    const [clicked, set_clicked] = useState(false);
    const [submitted, set_submitted] = useState(false);
    const [loading, set_loading] = useState(false);
    const navigate = useNavigate();

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        set_clicked(true);
        if (data.valid && !submitted) {
            set_submitted(true);
            set_loading(true);
            HomeService.new(data.value).result.then(r => {
                if (r.success) {
                    navigate("../");
                }
                else if (r.error) {
                    ErrorService.show(r.error);
                    set_loading(false);
                    set_submitted(false);
                }
                else if (r.input_error) {
                    data.get(r.input_error.name).set_error({username: r.input_error.message});
                    set_loading(false);
                    set_submitted(false);
                }
            });
        }
    }

    return <div id="new">
        {loading ? <Loading/> : null}
        <div className="container">
            <div className="card">
                <div className="title">New Link</div>
                <div className="body">
                    <form onSubmit={e => submit(e)}>
                        <FormGroup label={"Link"} control={data.get("link")} clicked={clicked}/>
                        <div className="align-right">
                            <Link to={"../"} className={"btn bg-secondary"}>Back</Link>
                            <button className="btn bg-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
};
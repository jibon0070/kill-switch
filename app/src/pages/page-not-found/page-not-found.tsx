import "./page-not-found.scss"
import {useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";

export default function PageNotFound() {
    const container_ref = useRef<HTMLDivElement>(null)
    const location = useLocation();
    useEffect(() => {
        if (container_ref.current) {
            const parent = container_ref.current.parentNode!;
            // @ts-ignore
            container_ref.current.style.minHeight = `${parent.clientHeight}px`;
        }
    }, [location]);
    return <div id="page-not-found" ref={container_ref}>
        <div className={'status-code'}>404</div>
        <div className="status">Page Not Found</div>
    </div>
};
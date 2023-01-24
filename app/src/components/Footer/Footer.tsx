import "./footer.scss"
import React from "react";
import {Link} from "react-router-dom";

export default function Footer({fref}: { fref?: React.Ref<HTMLDivElement> }) {
    return <div id="footer" ref={fref}>Contact Me at <a target={'_blank'} href={'https://www.facebook.com/atiurrahaman.jibon/'}>&copy;A.R. Jibon</a></div>
};
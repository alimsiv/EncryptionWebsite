import React from 'react';
import PropTypes from 'prop-types';
import Alertprac from "../Alert";
import Nav from "../Nav";

// Generic page wrapper
const Page = ({ title, children, contentStyle, ...rest }) => (
    <div {...rest}>
        <Alertprac />
        <Nav />
        <div className="container" style={{ marginTop: 60, marginBottom: 120, ...contentStyle }}>
            <h1>{title}</h1>
            {children}
        </div>
    </div>
);

Page.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    contentStyle: PropTypes.object,
};

export default Page;

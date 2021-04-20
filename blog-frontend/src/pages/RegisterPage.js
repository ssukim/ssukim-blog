import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import Register from '../containers/auth/RegisterForm'

const RegisterPage = () => {
    return (
        <AuthTemplate>
            <Register type="register"/>
        </AuthTemplate>
    );
};

export default RegisterPage;

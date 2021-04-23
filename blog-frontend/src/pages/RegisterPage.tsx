import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import Register from '../containers/auth/RegisterForm'

const RegisterPage = () => {
    return (
        <AuthTemplate>
            <Register/>
        </AuthTemplate>
    );
};

export default RegisterPage;

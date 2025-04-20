import { useEffect } from 'react';
// import { postLoginAccessToken } from '../../lib/apiClient';

const LoginAccessToken = () => {
    console.log(window.location.href.split('#')[1].split('&')[0].split('=')[1]);
    const handleLoginAccessToken = async () => {
        // const access_token = window.location.href.split('#')[1].split('&')[0].split('=')[1];

        try {
            // const response = await postLoginAccessToken(access_token);
            // console.log('response', response);
        } catch (error) {
            console.error('Error logging in with access token:', error);
        }
    }

    useEffect(() => {
        // const urlParams = new URLSearchParams(window.location.search);
        // const accessToken = urlParams.get('access_token');
        // const refreshToken = urlParams.get('refresh_token');
        // console.log(accessToken, refreshToken)
        handleLoginAccessToken();

    }, []);
    return (
        <div>
            <h1>Login with access token</h1>
        </div>
    );
}

export default LoginAccessToken;
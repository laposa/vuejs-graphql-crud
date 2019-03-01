import Vue from 'vue'
import VueApollo from 'vue-apollo'
import {createApolloClient} from 'vue-cli-plugin-apollo/graphql-client'
import gql from 'graphql-tag';


// Install the vue plugin
Vue.use(VueApollo);

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token';

// Config
const defaultOptions = {
    // LocalStorage token
    tokenName: AUTH_TOKEN,
    // Enable Automatic Query persisting with Apollo Engine
    persisting: false,

    getAuth: (tokenName) =>  {
        const token = localStorage.getItem(tokenName);
        return token ? `Bearer ${token}` : null;
    }
};



export function createProvider(options = {}) {
    // Create apollo client
    const {apolloClient} = createApolloClient({
        ...defaultOptions,
        ...options,
    });

    const {authentication} = options;

    if (authentication !== undefined) {
        authenticate(apolloClient, authentication.username, authentication.password);
    }

    // Create vue apollo provider
    return new VueApollo({
        defaultClient: apolloClient,
        defaultOptions: {
            $query: {
                fetchPolicy: 'no-cache'
            },
        },
        errorHandler(error) {
            if (error.message.includes('permission denied') && authentication !== undefined) {
                authenticate(apolloClient, authentication.username, authentication.password);
            }

            // eslint-disable-next-line no-console
            console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
        },
    })
}

async function authenticate(apolloClient, username, password) {
    const mutation = gql`mutation authenticate($username: String!, $password: String!) {
        authenticate (input: {username: $username, password: $password}) {
            jwToken
        }
    }`;

    const authResult = await apolloClient.mutate({
        mutation: mutation,
        variables: {
            username: username,
            password: password
        },
    });

    const jwToken = authResult.data.authenticate.jwToken;
    localStorage.setItem(AUTH_TOKEN, jwToken);
}

import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { onError } from "apollo-link-error";
import { Observable } from 'apollo-link';
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
};

export function createProvider(options = {}) {
    const {authentication} = options;

    const authClient = createApolloClient({
        ...defaultOptions,
        ...options,
    }).apolloClient;


    let link = null;
    if (authentication !== undefined) {
        link = onError(({ graphQLErrors, operation, forward }) => {
            if (graphQLErrors && graphQLErrors.find(err => err.message.includes('jwt malformed')) !== null) {
                return new Observable(observer => {
                    authenticate(authClient, authentication.username, authentication.password)
                        .then(jwToken => {
                            operation.setContext(({headers = {}}) => ({
                                headers: {
                                    // Re-add old headers
                                    ...headers,
                                    // Switch out old access token for new one
                                    authorization: jwToken ? `Bearer ${jwToken}` : null,
                                }
                            }))
                        })
                        .then(() => {
                            const subscriber = {
                                next: observer.next.bind(observer),
                                error: observer.error.bind(observer),
                                complete: observer.complete.bind(observer)
                            };

                            // Retry last failed request
                            forward(operation).subscribe(subscriber);
                        });
                });
            }
        });
    }

    // Create apollo client
    const {apolloClient} = createApolloClient({
        ...defaultOptions,
        ...options,
        link
    });

    if (authentication !== undefined) {
        authenticate(authClient, authentication.username, authentication.password);
    }

    // Create vue apollo provider
    return new VueApollo({
        defaultClient: apolloClient,
        defaultOptions: {
            $query: {
                fetchPolicy: 'no-cache'
            },
        }
    })
}

async function authenticate(apolloClient, username, password) {
    const mutation = gql`mutation authenticate($username: String!, $password: String!) {
        authenticate (input: {username: $username, password: $password}) {
            jwToken
        }
    }`;

    await localStorage.removeItem(AUTH_TOKEN);

    const authResult = await apolloClient.mutate({
        mutation: mutation,
        variables: {
            username: username,
            password: password
        },
    });

    const jwToken = authResult.data.authenticate.jwToken;
    localStorage.setItem(AUTH_TOKEN, jwToken);
    return jwToken;
}

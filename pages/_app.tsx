import { Box, Container, CssBaseline } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import { SWRConfig } from 'swr';
import { Nav } from '../components/Nav';
import Head from 'next/head';
import React from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'

// axios.defaults.baseURL = 'http://localhost:4001';

// Create a theme instance.
export const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6'
        },
        error: {
            main: red.A400
        },
        background: {
            default: '#fff'
        }
    }
});

function MyApp({ Component, pageProps }: AppProps) {
    return <React.Fragment>
        <Head>
            <title>My page</title>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width"
            />
        </Head>
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Nav />
            <SWRConfig
                value={{ fetcher: (url: string) => axios(url).then(r => r.data) }}
            >
                <Container maxWidth={false}>
                    <Box marginTop={2}>
                        <Component {...pageProps} />
                    </Box>
                </Container>
            </SWRConfig>
        </ThemeProvider>
    </React.Fragment>
}
export default MyApp

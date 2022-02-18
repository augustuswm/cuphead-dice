import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import s from '../styles/Home.module.css';
import { Settings, SettingsProvider, Storage } from '../components/Settings';
import { append, HistoryProvider } from '../components/RouteHistory';
import { useEffect } from 'react';

const storage: Storage<Settings> = {
  get(key: string) {
    if (typeof window !== 'undefined') {
      let value = localStorage.getItem(key);
      return value ? JSON.parse(value) : value;
    } else {
      return null;
    }
  },
  set(key: string, value: Settings) {
    if (typeof window !== 'undefined') {
      let existing = this.get(key);
      localStorage.setItem(key, JSON.stringify(value));
      return existing;
    } else {
      return null;
    }
  },
  delete(key: string) {
    if (typeof window !== 'undefined') {
      let existing = this.get(key);
      localStorage.removeItem(key);
      return existing;
    } else {
      return null;
    }
  }
}

function MyApp({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    router.events.on('routeChangeComplete', (url, rest) => {
      append(url);
      return true;
    })
  }, []);

  return <>
    <Head>
      <meta name='application-name' content='Cuphead: Fast Rolling Dice Game' />
      <meta name='description' content='Companion web app for Cuphead: Fast Rolling Dice Game' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='theme-color' content='#222222' />
      <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
      <link rel='manifest' href='/manifest.json' />

      {/* <link rel='shortcut icon' href='/favicon.ico' /> */}

      <title>Cuphead: Fast Rolling Dice Game</title>
    </Head>
    <div className={s.wrapper}>
      <HistoryProvider>
        <SettingsProvider storage={storage}>
          <AnimatePresence initial={false}>
            <Component {...pageProps} />
          </AnimatePresence>
        </SettingsProvider>
      </HistoryProvider>
    </div>
  </>
}

export default MyApp
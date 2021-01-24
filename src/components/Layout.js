import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import Header from '../components/Header';
import { widths } from '../utils/constants';

const Layout = ({ children }) => (
  <div className="App">
    <Header />
    <div className={css(styles.wrapper)}>{children}</div>
  </div>
);

export default Layout;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 'auto',
    [`@media ${widths.device}`]: {
      width: '100%',
    },
  },
});

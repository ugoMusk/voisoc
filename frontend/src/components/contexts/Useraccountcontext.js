// AccountContext.js
import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Create context for account data
const AccountContext = createContext();

// Custom hook to use account data
export const useAccount = () => useContext(AccountContext);

// AccountProvider component to provide context value to the children
export const AccountProvider = ({ children }) => {
  const [accountData, setAccountData] = useState(null);

  return (
    <AccountContext.Provider value={{ accountData, setAccountData }}>
      {children}
    </AccountContext.Provider>
  );
};

// Define PropTypes for AccountProvider
AccountProvider.propTypes = {
  children: PropTypes.node.isRequired, // Expecting children as a node
};

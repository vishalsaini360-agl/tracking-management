import React, { createContext, useContext } from 'react';

const DarkStoreHelperContext = createContext({
  handleTabChangeDarkStoreHelperProvider: () => {}
});

export const DarkStoreHelperProvider = ({ children }) => {
  return (
    <DarkStoreHelperContext.Provider
      value={{
        handleTabChangeDarkStoreHelperProvider: () => {}
      }}
    >
      {children}
    </DarkStoreHelperContext.Provider>
  );
};

export const useDarkStoreHelperContext = () => {
  return useContext(DarkStoreHelperContext);
};

export default DarkStoreHelperProvider;

import { createContext, useContext, useMemo, useState } from "react";



const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const [state, setState] = useState({
    loading: false,
    err: '',
    success: ''
  });

  const value = useMemo(() => {
    const toggleLoading = (val) =>
      setState({
        ...state,
        loading: val,
      });
    
    const setErr = (err) =>
    setState({
    ...state,
    err: err
    });

    const setSuccess = (val) =>
    setState({
    ...state,
    success: val
    });


    return {
      ...state,
      setErr,
      toggleLoading,
      setSuccess
    };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// import { createContext, useReducer } from "react";
// import reducer from "../reducer/sidebarReducer";
// import PropTypes from 'prop-types';

// const initialState = {
//     isSidebarOpen: false
// }

// export const SidebarContext = createContext({});
// export const SidebarProvider = ({ children }) => {
//     const [state, dispatch] = useReducer(reducer, initialState);
//     const toggleSidebar = () => {
//         dispatch({ type: "TOGGLE_SIDEBAR" })
//     }
//     return (
//         <SidebarContext.Provider value = {{
//             ...state,
//             toggleSidebar
//         }}>
//             { children }
//         </SidebarContext.Provider>
//     )
// }

// SidebarProvider.propTypes = {
//     children: PropTypes.node
// }



import React, { createContext, useReducer, useState } from "react";
import PropTypes from "prop-types";
import reducer from "../reducer/sidebarReducer";

// Initial state for the sidebar
const initialState = {
    isSidebarOpen: false,
};

// Action types for better maintainability
const ACTION_TYPES = {
    TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
};

// Create the Sidebar Context
export const SidebarContext = createContext(initialState);

// Sidebar Provider Component
export const SidebarProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [role , SetRole] = useState([]);
const [department, SetDepartment] = useState([]);
const [user, UserData] =useState([])




    // Toggle the sidebar state
    const toggleSidebar = () => {
        dispatch({ type: ACTION_TYPES.TOGGLE_SIDEBAR });
    };

    return (
        <SidebarContext.Provider
            value={{
                isSidebarOpen: state.isSidebarOpen, // Explicitly providing state
                toggleSidebar,
                role , SetRole,
                department, SetDepartment,
                user, UserData
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};

// Prop type validation
SidebarProvider.propTypes = {
    children: PropTypes.node.isRequired, // Ensures `children` is provided
};

// Default export for easier imports
export default SidebarProvider;

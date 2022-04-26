import { useContext } from 'react';
import ReducerContext from '../context/ReducerContext';
import PropTypes from 'prop-types';

export function ProtectedContainer({ children, nonAuth, requireRoles }) {
    const { state } = useContext(ReducerContext)
    const { auth } = state;

    if (auth && nonAuth === true) return null;

    if (!auth && nonAuth === false) return null;

    if (auth && Array.isArray(requireRoles) && !requireRoles.some(r => auth.role.indexOf(r) > -1)) return null;

    return (
        <>
            {children}
        </>
    );
}

ProtectedContainer.propTypes = {
    nonAuth: PropTypes.bool.isRequired,
    requireRoles: PropTypes.arrayOf(PropTypes.string)
}

ProtectedContainer.defaultProps = {
    nonAuth: false
}

export default ProtectedContainer;
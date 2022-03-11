import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import FilterContext from '../context/FilterContext';

export const ProtectedRoute = ({
  redirectPath,
  children,
}) => {

  const {auth} = useContext(FilterContext);

  if (!auth) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string.isRequired,
  children: PropTypes.node
}

ProtectedRoute.defaultProps = {
  redirectPath: '/login'
}

export default ProtectedRoute
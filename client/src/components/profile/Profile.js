import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfilebyID } from '../../actions/profile';

const Profile = ({
  getProfilebyID,
  match,
  profile: { profile, loading },
  auth,
}) => {
  useEffect(() => {
    getProfilebyID(match.params.id);
  }, [getProfilebyID]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' class='btn btn-light'>
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfilebyID: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const useStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(useStateToProps, { getProfilebyID })(Profile);

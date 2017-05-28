import React, { PropTypes } from 'react';
import { Button } from '../../App/elemental';

// TODO Figure out if we should change "Keystone" to "Admin area"

const UserInfo = ({
	adminPath,
	signoutPath,
	userCanAccessKeystone,
	userName,
}) => {
	const adminButton = userCanAccessKeystone ? (
		<Button href={adminPath} color="primary">
			Avaa hallintapaneeli
		</Button>
	) : null;

	return (
		<div className="auth-box__col">
			<p>Hei, {userName},</p>
			<p>Olet jo kirjautuneena sisään.</p>
			{adminButton}
			<Button href={signoutPath} variant="link" color="cancel">
				Kirjaudu ulos
			</Button>
		</div>
	);
};

UserInfo.propTypes = {
	adminPath: PropTypes.string.isRequired,
	signoutPath: PropTypes.string.isRequired,
	userCanAccessKeystone: PropTypes.bool,
	userName: PropTypes.string.isRequired,
};

module.exports = UserInfo;

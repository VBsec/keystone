import moment from 'moment';

const DATE_FORMAT = 'D MM YYYY';
const DATETIME_FORMAT = 'D MMM YYYY h:mm:ss';

function getFilterLabel (field, value) {
	const label = field.label;

	switch (field.type) {
		// BOOLEAN
		case 'boolean': {
			return value.value
				? label
				: `EI ${label}`;
		}

		// DATE
		case 'date': {
			return `${label} ${resolveDateFormat(value, DATE_FORMAT)}`;
		}

		// DATE ARRAY
		case 'datearray': {
			const presence = value.presence === 'some' ? 'Osa' : 'Ei';

			return `${presence} ${label} ${resolveDateFormat(value, DATETIME_FORMAT, 'ovat')}`;
		}

		// DATETIME
		case 'datetime': {
			return `${label} ${resolveDateFormat(value, DATETIME_FORMAT)}`;
		}

		// GEOPOINT
		// TODO distance needs a qualifier, currently defaults to "km"?
		case 'geopoint': {
			const mode = value.distance.mode === 'max' ? 'is within' : 'is at least';
			const distance = `${value.distance.value}km`;
			const conjunction = value.distance.mode === 'max' ? 'of' : 'from';
			const latlong = `${value.lat}, ${value.lon}`;

			return `${label} ${mode} ${distance} ${conjunction} ${latlong}`;
		}

		// LOCATION
		case 'location': {
			const joiner = value.inverted ? 'EI osu' : 'osuu';

			// Remove undefined values before rendering the template literal
			const formattedValue = [
				value.street,
				value.city,
				value.state,
				value.code,
				value.country,
			].join(' ').trim();

			return `${label} ${joiner} "${formattedValue}"`;
		}

		// NUMBER & MONEY
		case 'number':
		case 'money': {
			return `${label} ${resolveNumberFormat(value)}`;
		}

		// NUMBER ARRAY
		case 'numberarray': {
			const presence = value.presence === 'some' ? 'Osa' : 'Ei';

			return `${presence} ${label} ${resolveNumberFormat(value, 'ovat')}`;
		}

		// PASSWORD
		case 'password': {
			return value.exists
				? `${label} on asetettu`
				: `${label} EI ole asetettu`;
		}

		// RELATIONSHIP
		// TODO populate relationship, currently rendering an ID
		case 'relationship': {
			let joiner = value.inverted ? 'EI ole' : 'on';
			let formattedValue = (value.value.length > 1)
				? value.value.join(', tai ')
				: value.value[0];

			return `${label} ${joiner} ${formattedValue}`;
		}

		// SELECT
		case 'select': {
			let joiner = value.inverted ? 'EI ole' : 'on';
			let formattedValue = (value.value.length > 1)
				? value.value.join(', tai ')
				: value.value[0];

			return `${label} ${joiner} ${formattedValue}`;
		}

		// TEXT-LIKE
		case 'code':
		case 'color':
		case 'email':
		case 'html':
		case 'key':
		case 'markdown':
		case 'name':
		case 'text':
		case 'textarea':
		case 'url': {
			let mode = '';
			if (value.mode === 'beginsWith') {
				mode = value.inverted ? 'EI ala' : 'alkaa';
			} else if (value.mode === 'endsWith') {
				mode = value.inverted ? 'EI lopu' : 'loppuu';
			} else if (value.mode === 'exactly') {
				mode = value.inverted ? 'EI ole' : 'on';
			} else if (value.mode === 'contains') {
				mode = value.inverted ? 'EI sisällä' : 'sisältää';
			}

			return `${label} ${mode} "${value.value}"`;
		}

		// TEXTARRAY
		case 'textarray': {
			const presence = value.presence === 'some' ? 'Osa' : 'Ei';
			let mode = '';
			if (value.mode === 'beginsWith') {
				mode = value.inverted ? 'EI ala' : 'alkaa';
			} else if (value.mode === 'endsWith') {
				mode = value.inverted ? 'EI lopu' : 'loppuu';
			} else if (value.mode === 'exactly') {
				mode = value.inverted ? 'EI ole' : 'on';
			} else if (value.mode === 'contains') {
				mode = value.inverted ? 'EI sisällä' : 'sisältää';
			}

			return `${presence} ${label} ${mode} "${value.value}"`;
		}

		// CATCHALL
		default: {
			return `${label} "${value.value}"`;
		}
	}
};

function resolveNumberFormat (value, conjunction = 'on') {
	let mode = '';
	if (value.mode === 'equals') mode = conjunction;
	else if (value.mode === 'gt') mode = `${conjunction} suurempi kuin`;
	else if (value.mode === 'lt') mode = `${conjunction} pienempi kuin`;

	const formattedValue = value.mode === 'between'
		? `on välillä ${value.value.min} ja ${value.value.max}`
		: value.value;

	return `${mode} ${formattedValue}`;
}

function resolveDateFormat (value, format, conjunction = 'on') {
	const joiner = value.inverted ? `${conjunction} NOT` : conjunction;
	const mode = value.mode === 'on' ? '' : value.mode;
	const formattedValue = value.mode === 'between'
		? `${moment(value.after).format(format)} ja ${moment(value.before).format(format)}`
		: moment(value.value).format(format);

	return `${joiner} ${mode} ${formattedValue}`;
}

module.exports = getFilterLabel;

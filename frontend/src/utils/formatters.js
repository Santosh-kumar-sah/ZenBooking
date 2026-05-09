import { format, isBefore, parseISO } from 'date-fns';

const getInitials = (name = '') => name
	.split(' ')
	.filter(Boolean)
	.slice(0, 2)
	.map((part) => part[0]?.toUpperCase() || '')
	.join('') || '?';

const avatarPalette = [
	'bg-gradient-to-br from-primary-500 to-accent-500',
	'bg-gradient-to-br from-sky-500 to-cyan-500',
	'bg-gradient-to-br from-emerald-500 to-teal-500',
	'bg-gradient-to-br from-amber-500 to-orange-500',
	'bg-gradient-to-br from-pink-500 to-rose-500',
	'bg-gradient-to-br from-violet-500 to-fuchsia-500',
	'bg-gradient-to-br from-indigo-500 to-blue-500',
	'bg-gradient-to-br from-lime-500 to-green-500'
];

const hashName = (name = '') => name.split('').reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0);
const getAvatarColor = (name = '') => avatarPalette[Math.abs(hashName(name)) % avatarPalette.length];

const formatDate = (value) => {
	try {
		const date = typeof value === 'string' ? parseISO(value) : value;
		return format(date, 'EEEE dd MMMM yyyy'); // Monday 12 May 2026
	} catch (e) {
		return String(value);
	}
};

const formatTime = (time24 = '') => {
	// Accept hh:mm or hh:mm:ss or HH:mm strings
	if (!time24) return '';
	try {
		const [hoursStr, minutesStr] = time24.split(':');
		let hours = Number(hoursStr);
		const minutes = Number(minutesStr || 0);
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;
		return `${hours}:${String(minutes).padStart(2, '0')} ${ampm}`;
	} catch (e) {
		return time24;
	}
};

const isPastDate = (value) => {
	try {
		const date = typeof value === 'string' ? parseISO(value) : value;
		return isBefore(date, new Date());
	} catch (e) {
		return false;
	}
};

const truncate = (value = '', max = 0) => {
	const text = String(value);
	return text.length > max ? `${text.slice(0, Math.max(0, max - 1))}…` : text;
};

const formatCurrency = (value, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(value || 0));
const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Number(value || 0));
const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

export { getInitials, getAvatarColor, formatDate, formatTime, isPastDate, truncate, formatCurrency, formatNumber, formatPercent };
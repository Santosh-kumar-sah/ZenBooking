import { Badge } from '../ui/Badge.jsx';

const BookingStatusBadge = ({ status }) => <Badge status={status}>{status}</Badge>;

export { BookingStatusBadge };
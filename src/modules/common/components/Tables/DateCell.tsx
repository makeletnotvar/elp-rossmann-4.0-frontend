import moment from 'moment';
import * as React from 'react';

const DateCell: React.FunctionComponent<any> = ({ value }) => (value ? <PrettyDate value={value} /> : <label>-</label>);

const PrettyDate: React.FC<{ value: number }> = ({ value }) => <label title={moment(value).fromNow()}>{value > 0 ? moment(value).format('lll') : '-'}</label>;

export default DateCell;

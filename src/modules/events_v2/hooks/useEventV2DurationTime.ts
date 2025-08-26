import { DAY_IN_MS, HOUR_IN_MS } from 'constants/date';
import { isValidTimestamp } from 'helpers/date';
import moment from 'moment';

const useEventV2DurationTime = (activeTs: number, deactiveTs: number | undefined | null) => {
	const now = moment(Date.now());
	const active = moment(activeTs);
	const deactive = moment(deactiveTs || 0);
	const isValidDeactiveTs = isValidTimestamp(deactiveTs);
	const diffMilliseconds = (isValidDeactiveTs ? deactiveTs! : Date.now()) - activeTs;
	let durationType: 'minutes' | 'hours' | 'days' = 'minutes';

	if (diffMilliseconds > DAY_IN_MS) {
		durationType = 'days';
	} else if (diffMilliseconds > HOUR_IN_MS) {
		durationType = 'hours';
	}

	const duration = deactiveTs! > 0 ? deactive.diff(active, durationType) : now.diff(active, durationType);

	return { durationType, duration, diffMilliseconds };
};

export default useEventV2DurationTime;

import L, { point } from 'leaflet';
import { getAlarmColor } from 'modules/map/helpers/getAlarmColor';

export default ({ data, count }: MapBuildingGroupPin) => {
	const [alarmsCount, maxAlarmPriority] = data;
	const fill = getAlarmColor(alarmsCount > 0, false, maxAlarmPriority);

	return new L.DivIcon({
		className: '',
		iconSize: point(65, 65, true),
		html: `
            <div class="m-g" style="color:${fill}99"><span style="background:${fill}bb">${count || ''}</span></div>
        `,
	});
};

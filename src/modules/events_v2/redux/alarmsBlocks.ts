import { API } from 'api/axios';
import eventsApi from 'api/endpoints/eventsAPI';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { compareAlarmsBlocks } from 'modules/events_v2/helpers/compareAlarmsBlocks';
import { Config, createModule } from 'vredux';
import { ElpEventV2AlarmBlockIdentifyProps } from '../interfaces/eventV2-alarm-block-identify.interface';
import { ElpEventV2AlarmBlockInstance } from '../interfaces/eventV2-alarm-block-instance.interface';
import { ElpEventV2AlarmBlock } from '../interfaces/eventV2-alarm-block.interface';
import { AlarmsBlocksRootState } from './index';

export interface AlarmsBlocksData {
	alarmsBlocks: ElpEventV2AlarmBlockInstance[];
	count: number;
	countAll: number;
}

export interface AlarmsBlocksResponse {
	alarmsBlocks: ElpEventV2AlarmBlockInstance[];
	count: number;
	countAll: number;
}

const config: Config<AlarmsBlocksData> = {
	name: 'alarmsBlocks',
	initialData: {
		alarmsBlocks: [],
		count: -1,
		countAll: -1,
	},
	actions: {
		fetch: async (data, settings) => {
			const response = await API.get<AlarmsBlocksResponse>(eventsApi.getAlarmsBlocks(settings));
			if (response.status === 200) {
				const { alarmsBlocks, count, countAll } = response.data;
				return { ...data, alarmsBlocks, count, countAll };
			} else {
				return { ...data };
			}
		},
		update: async (data, alarmBlock: ElpEventV2AlarmBlockInstance) => {
			const response = await API.put<{ alarmBlock: ElpEventV2AlarmBlock }>(eventsApi.updateAlarmBlock(), { alarmBlock: alarmBlock });
			if (response.status === 200) {
				return {
					...data,
					alarmsBlocks: data.alarmsBlocks.map(nextAlarmBlock => {
						if (compareAlarmsBlocks(nextAlarmBlock, response.data.alarmBlock as any)) {
							return {
								...nextAlarmBlock,
								...response.data.alarmBlock,
							};
						} else {
							return nextAlarmBlock;
						}
					}),
				};
			} else {
				return { ...data };
			}
		},
		delete: async (data, deleteAlarmBlock: ElpEventV2AlarmBlockIdentifyProps) => {
			const response = await API.delete(eventsApi.deleteAlarmBlock(deleteAlarmBlock.deviceUUID, deleteAlarmBlock.code));
			if (response.status === 204) {
				return {
					...data,
					alarmsBlocks: data.alarmsBlocks.filter(alarmBlock => !compareAlarmsBlocks(alarmBlock, deleteAlarmBlock)),
				};
			} else {
				return { ...data };
			}
		},
	},
};

export const { reducer: alarmsBlocksReducer, actions: alarmsBlocksActions } = createModule<AlarmsBlocksData>(config);
export const useAlarmsBlocksState = () => useSelector((state: AlarmsBlocksRootState) => state.alarmsBlocks);

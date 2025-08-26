import { VirtualHmi } from 'modules/common/components/VirtualHMI/services/virtualHMI';
import { VirtualHMIData } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import { useEffect, useState } from 'react';

export function useVHMI(setIsLoading: (isLoading: boolean) => void) {
	const [data, setData] = useState<VirtualHMIData[]>([]);

	useEffect(() => {
		(window as any).vHmi = new VirtualHmi();
		(window as any).vHmi.setDataChangeCallback((nextData: VirtualHMIData[]) => {
			setData(nextData);
		});
	}, []);

	useEffect(() => {
		setIsLoading(false);
	}, [JSON.stringify(data)]);

	return {
		data,
	};
}

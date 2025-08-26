interface Unit {
	id: number;
	xid: string;
	name: string;
	params: UnitParam[];
	online?: boolean;
}

interface UnitParam {
	param: string;
	value: string;
}

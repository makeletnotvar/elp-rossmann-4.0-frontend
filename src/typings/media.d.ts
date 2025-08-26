type MediaCosumptionsPeriodType = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';

type MediaConsumptionsSource = 'TOTAL' | 'AC'

type MediaConsumptionsRequestSettings = {
  deviceUUID?: string;
  period?: MediaCosumptionsPeriodType;
  source?: MediaConsumptionsSource;
  fromTs?: number;
  toTs?: number;
};

interface MediaDevice extends Device {
  alarmsCount: number;
  alarmsMaxPriority: number;
}

type MediaParamsRequestSettings = {
  p?: string[];
  deviceUUID?: string;
  fromTs?: number;
  toTs?: number;
};

interface MediaPointData {
  name: string;
  uuid: string;
  values: { value: number, ts: number }[];
};


interface MediaPointsData {
  [xid: string]: MediaPointData;
}

interface MediaConsumptionData {
  name: string;
  uuid: string;
  values: {
    dateKey: number;
    consumption: number;
    startValue: {
      value: number;
      ts: number;
    },
    endValue: {
      value: number;
      ts: number;
    }
  }[];
};
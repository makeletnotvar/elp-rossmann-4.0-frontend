const { fakeUUID } = require("./../fakeData");

let tested_devices = {};
let points = {
  aaaa: {
    uuid: "aaaa",
    active: true,
    xid: "tset",
    value: () => Math.random() * 100,
    type: "numeric",
    registerName: "aaaa",
    registerNumber: 0,
    customRender: {
      decimals: 2,
      suffix: "°C",
      min: 0,
      max: 100,
    },
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
  },
  bbbb: {
    uuid: "bbbb",
    xid: "tmain",
    active: true,
    type: "numeric",
    registerName: "bbbb",
    registerNumber: 1,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "%",
      min: 0,
      max: 100,
    },
    value: () => Math.round(Math.random() * 100),
  },
  "ea1f0d22-mode": {
    uuid: "ea1f0d22-mode",
    xid: "mode",
    active: true,
    type: "enum",
    registerName: "cccc",
    registerSettable: true,
    registerNumber: 2,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Stop",
        1: "1 Bieg",
        2: "2 Bieg",
        3: "Obniżenie",
      },
    },
    value: () => Math.round(Math.random() * 3),
  },
  "hihoud93w8-alarm": {
    uuid: "hihoud93w8-alarm",
    xid: "alarm",
    active: true,
    type: "enum",
    registerName: "dddd",
    registerNumber: 3,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Nieaktywny",
        1: "Aktywny",
      },
    },
    value: () => Math.round(Math.random()),
  },
  "fc-sup": {
    uuid: "fc-sup",
    xid: "fc-sup",
    active: true,
    value: () => Math.random() * 100,
    type: "numeric",
    registerName: "fc_sup",
    registerNumber: 0,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 2,
      suffix: "%",
      min: 0,
      max: 100,
    },
  },
  "fc-exh": {
    uuid: "fc-exh",
    xid: "fc-exh",
    value: () => Math.random() * 100,
    type: "numeric",
    registerName: "fc_exh",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 2,
      suffix: "%",
      min: 0,
      max: 100,
    },
  },
  tset_cash_area: {
    name: "Temperatura strefa kas",
    uuid: "tset_cash_area",
    xid: "tset_cash_area",
    type: "numeric",
    registerName: "bbbb",
    active: true,
    registerNumber: 1,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "°C",
      min: 0,
      max: 100,
    },
    building: {
      uuid: "6ca727c5-48e8-47cc-8665-1e9fc2df3ebd",
      name: "Koło",
    },
    value: () => 21 + Math.random() * 1,
  },
  tset_general_area: {
    name: "Temperatura strefa ogólna",
    uuid: "tset_cash_area",
    xid: "tset_cash_area",
    type: "numeric",
    registerName: "bbbb",
    registerNumber: 1,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "°C",
      min: 0,
      max: 100,
    },
    value: () => 21 + Math.random() * 1,
  },
  workmode: {
    name: "Tryb pracy",
    uuid: "workmode",
    xid: "workmode",
    value: () => Math.round(Math.random() * 2),
    type: "enum",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    registerSettable: true,
    settable: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Stop",
        1: "Praca-dyżurna",
        2: "Praca",
        4: "-",
        8: "Wygrz.wstępne",
        16: "Schładzanie",
        32: "Wygrzewanie",
        64: "Stop-awaria",
        128: "Tryb serwisowy",
      },
    },
    building: {
      uuid: "6ca727c5-48e8-47cc-8665-1e9fc2df3ebd",
      name: "Koło",
    },
  },
  fc_s2_onoff: {
    name: "Klimakonwektor strefa 2 - onoff",
    uuid: "fc_s2_onoff",
    xid: "fc_s2_onoff",
    value: () => 0,
    type: "enum",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Stop",
        1: "Praca",
        2: "Kalendarz",
      },
    },
  },
  fc_s2_tmain: {
    name: "Klimakonwektor strefa 2 - onoff",
    uuid: "fc_s2_tmain",
    xid: "fc_s2_tmain",
    value: () => 20 + Math.random() * 3,
    type: "numeric",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Stop",
        1: "Praca",
        2: "Kalendarz",
      },
    },
  },
  fc_s2_mode: {
    name: "Klimakonwektor strefa 2 - mode",
    uuid: "fc_s2_mode",
    xid: "fc_s2_mode",
    value: () => 0,
    type: "enum",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Stop",
        1: "Auto",
        2: "1 Bieg",
        3: "2 Bieg",
        4: "3 Bieg",
      },
    },
  },
  fc_s2_alarm: {
    name: "Klimakonwektor strefa 2 - alarm",
    uuid: "fc_s2_alarm",
    xid: "fc_s2_alarm",
    value: () => 0,
    type: "binary",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Ok",
        1: "Alarm",
      },
    },
  },
  fc_s2_com: {
    name: "Klimakonwektor strefa 2 - com",
    uuid: "fc_s2_com",
    xid: "fc_s2_com",
    value: () => 0,
    type: "binary",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Ok",
        1: "Alarm",
      },
    },
  },
  em_1_act_sum: {
    name: "Suma energii czynnej",
    uuid: "em_1_act_sum",
    xid: "em_1_act_sum",
    active: true,
    type: "numeric",
    registerName: "em_1_act_sum",
    registerNumber: 1,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "°C",
      min: 0,
      max: 100,
    },
    value: () => 15 + Math.random() * 10,
  },
  em_1_react_sum: {
    name: "Suma energii biernej",
    uuid: "em_1_react_sum",
    xid: "em_1_react_sum",
    active: true,
    type: "numeric",
    registerName: "em_1_react_sum",
    registerNumber: 1,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "°C",
      min: 0,
      max: 100,
    },
    value: () => 15 + Math.random() * 10,
  },
  em_1_l1: {
    name: "Prąd faza 1",
    uuid: "em_1_l1",
    xid: "em_1_l1",
    active: true,
    type: "numeric",
    registerName: "em_1_l1",
    registerNumber: 1,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "°C",
      min: 0,
      max: 100,
    },
    value: () => 15 + Math.random() * 10,
  },
  em_1_l2: {
    name: "Prąd faza 2",
    uuid: "em_1_l2",
    xid: "em_1_l2",
    active: true,
    type: "numeric",
    registerName: "em_1_l2",
    registerNumber: 1,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "°C",
      min: 0,
      max: 100,
    },
    value: () => 15 + Math.random() * 10,
  },
  em_1_l3: {
    name: "Prąd faza 3",
    uuid: "em_1_l3",
    xid: "em_1_l3",
    active: true,
    type: "numeric",
    registerName: "em_1_l3",
    registerNumber: 1,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "°C",
      min: 0,
      max: 100,
    },
    value: () => 15 + Math.random() * 10,
  },
  em_1_v12: {
    name: "Napięcie faza 1-2",
    uuid: "em_1_v12",
    xid: "em_1_v12",
    active: true,
    type: "numeric",
    registerName: "em_1_v12",
    registerNumber: 1,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "°C",
      min: 0,
      max: 100,
    },
    value: () => 15 + Math.random() * 10,
  },
  em_2_v12: {
    name: "Napięcie faza 1-2",
    uuid: "em_2_v12",
    xid: "em_2_v12",
    active: true,
    type: "numeric",
    registerName: "em_2_v12",
    registerNumber: 1,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "°C",
      min: 0,
      max: 100,
    },
    value: () => 15 + Math.random() * 10,
  },

  // Curtain

  cur_onoff: {
    name: "Kurtyna stan",
    uuid: "cur_onoff",
    xid: "cur_onoff",
    value: () => 1,
    type: "enum",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Ok",
        1: "Alarm",
      },
    },
  },
  cur_mode: {
    name: "Kurtyna tryb",
    uuid: "cur_mode",
    xid: "cur_mode",
    value: () => 2,
    type: "enum",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Ok",
        1: "Alarm",
      },
    },
  },
  cur_tout: {
    name: "Kurtyna stan",
    uuid: "cur_tout",
    xid: "cur_tout",
    value: () => 0,
    type: "enum",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Ok",
        1: "Alarm",
      },
    },
  },
  cur_vent: {
    name: "Kurtyna wentylator",
    uuid: "cur_vent",
    xid: "cur_vent",
    value: () => 0,
    type: "enum",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Ok",
        1: "Alarm",
      },
    },
  },
  cur_com: {
    name: "Kurtyna komunikacja",
    uuid: "cur_com",
    xid: "cur_com",
    value: () => 0,
    type: "enum",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Ok",
        1: "Alarm",
      },
    },
  },
  cur_alarm: {
    name: "Kurtyna alarm",
    uuid: "cur_alarm",
    xid: "cur_alarm",
    value: () => 0,
    type: "enum",
    registerName: "workMode",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Ok",
        1: "Alarm",
      },
    },
  },
  pc_s2_onoffr: {
    name: "PC S2 stan",
    uuid: "pc_s2_onoffr",
    xid: "pc_s2_onoffr",
    value: () => 1,
    type: "enum",
    registerName: "onoff",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Ok",
        1: "Alarm",
      },
    },
  },
  pc_s2_alarm: {
    name: "PC S2 alarm",
    uuid: "pc_s2_alarm",
    xid: "pc_s2_alarm",
    value: () => 0,
    type: "enum",
    registerName: "alarm",
    registerNumber: 0,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Ok",
        1: "Alarm",
      },
    },
  },
  em1energyCheckAct: {
    name: "em 1 energyCheckAct",
    uuid: "em1energyCheckAct",
    xid: "em_1_energyCheckAct",
    value: () => Math.round(Math.random()),
    type: "enum",
    registerName: "em_1_energyCheckAct",
    registerNumber: 0,
    registerSettable: true,
    settable: true,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      states: {
        0: "Nieaktywny",
        1: "Aktywny",
      },
    },
  },
  em1EnergyLimit: {
    name: "em 1 EnergyLimit",
    uuid: "em1EnergyLimit",
    xid: "em_1_EnergyLimit",
    type: "numeric",
    registerName: "em_1_EnergyLimit",
    registerNumber: 0,
    registerSettable: true,
    settable: true,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 1,
      suffix: "kW",
      min: 0,
    },
    value: () => 15 + Math.random() * 100,
  },
  hourOnOn: {
    name: "hour On",
    uuid: "hourOnOn",
    xid: "hourOn",
    value: () => Number((Math.random() * (23 - 0) + 0).toFixed()),
    type: "numeric",
    registerName: "hourOn",
    registerNumber: 0,
    registerSettable: true,
    settable: true,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      min: 0,
      max: 23,
      step: 1,
    },
  },
  hourOffOff: {
    name: "hour Off",
    uuid: "hourOffOff",
    xid: "hourOff",
    value: () => Number((Math.random() * (23 - 0) + 0).toFixed()),
    type: "numeric",
    registerName: "hourOff",
    registerNumber: 0,
    registerSettable: true,
    settable: true,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      min: 0,
      max: 23,
      step: 1,
    },
  },
  em1delay: {
    name: "em 1 delay",
    uuid: "em1delay",
    xid: "em_1_delay",
    value: () => Number((Math.random() * (15 - 0) + 0).toFixed()),
    type: "numeric",
    registerName: "em_1_delay",
    registerNumber: 0,
    registerSettable: true,
    settable: true,
    active: true,
    archive: true,
    archiveConfig: {
      time: 544,
      change: 0,
    },
    customRender: {
      decimals: 0,
      suffix: "min",
      min: 0,
      max: 15,
      step: 1,
    },
  },
};

let devices = [
  {
    uuid: "b945db1a-d84e-488c-96fc-7e9464986659",
    code: "382DD405534B373928501851",
    name: "S - Wrocław",
    model: "ELP11R32V-(H)",
    softinfo: "1337-2024",
    firmware: "2024110601",
    description: "Sterownik Wrocław",
    tags: ["Tag"],
    active: true,
    remoteIpAddress: "1.3.3.7",
    connection: true,
    addTs: Date.now(),
    editTs: Date.now(),
    user: {
      uuid: "xxxx-user-abcd-efgh-0dev",
      name: "dev@el-piast.com",
    },
    building: {
      uuid: "6ca727c5-48e8-47cc-8665-1e9fc2df3ebd",
      name: "B - Wrocław",
    },
    points: Object.values(points).map((p) => ({ uuid: p.uuid, name: p.name })),
    lastSync: Date.now() - 120 * 1000,
    syncPeriod: 60,
    error: false,
  },
];

const getDevices = (req, res) => {
  res.send({ devices, countAll: 1, count: 1 });
};

const getDevice = (req, res) => {
  const { uuid } = req.params;
  const foundDevice = devices.find((dev) => dev.uuid === uuid);
  res.send({ device: foundDevice || { ...devices[0], uuid: req.params.uuid } });
};

const addDevice = (req, res) => {
  const {
    device: { code, name = "", description = "" },
  } = req.body;
  const tested = tested_devices[code];
  const dev = {
    code,
    name,
    description,
    uuid: fakeUUID(),
    firmware: tested ? tested.firmware : "",
    softinfo: tested ? tested.softinfo : "",
    model: tested ? tested.model : "",
    description: "",
    tags: [],
    active: true,
    addTs: Date.now(),
    editTs: Date.now(),
    user: {
      uuid: fakeUUID(),
      name: "admin",
    },
    points: [],
    building: null,
  };

  devices.push(dev);
  res.send({ device: dev });
};

const updateDevice = (req, res) => {
  const { device } = req.body;
  const { uuid } = req.params;
  const currentDevice = devices.find((d) => d.uuid === uuid) || {};
  const nextDevice = { ...currentDevice, ...device, uuid };
  devices = devices.map((d) => (d.uuid === uuid ? nextDevice : d));
  res.send({ device: nextDevice });
};

const removeDevice = (req, res) => {
  const { uuid } = req.params;
  devices = devices.filter((d) => d.uuid === uuid);
  res.send({ devices });
};

const additionalRegisters = (points) => {
  let out = [];
  for (let i = 0; i <= 50; i++) {
    const name = "p_" + i;
    if (Object.values(points).findIndex((p) => p.registerName !== name) > -1) {
      out.push({
        customName: "punkt " + i,
        name,
        number: 100 + i,
        type: Math.random() < 0 ? "enum" : "numeric",
      });
    }
  }
  return out;
};

const getDeviceRegisters = (req, res) => {
  const registers = additionalRegisters(points);
  setTimeout(
    () =>
      res.send({
        registers: [
          ...Object.values(points).map((point, index) => ({
            customName: "punkt " + point.xid,
            name: point.registerName,
            number: point.xid === "em_1_energyCheckAct" || point.xid === "em_1_EnergyLimit" ? point.registerNumber + 1 : point.registerNumber,
            type: Math.random() < 0.5 ? "enum" : "numeric",
            customRender: point.xid === "em_1_EnergyLimit" ? { test: true } : point.customRender,
          })),
          ...registers,
        ],
      }),
    1000
  );
};

const updateDevicePoint = (req, res) => {
  const { point } = req.body;
  points[point.uuid] = {
    ...points[point.uuid],
    ...point,
  };
  res.send({
    point: points[point.uuid],
  });
};

const addDevicesPoints = (req, res) => {
  const { uuid } = req.params;
  const { pointsRefs } = req.body;
  const newPoints = pointsRefs.map((pointRef) => {
    const { registerName, registerNumber, type } = pointRef;
    return {
      name: registerName,
      uuid: fakeUUID(),
      xid: registerName,
      type,
      registerName,
      registerNumber,
    };
  });
  const device = devices.find((device) => device.uuid === uuid);
  if (device) {
    device.points = [...device.points, ...newPoints.map((point) => ({ uuid: point.uuid, name: point.name }))];
  }
  newPoints.forEach((point) => {
    points[point.uuid] = point;
  });
  res.send({ device });
};

const deleteDevicePoint = (req, res) => {
  const { uuid } = req.params;
  devices.forEach((device) => {
    device.points = device.points.filter((point) => point.uuid !== uuid);
  });
  points = Object.entries(points).reduce((ob, [key, value]) => {
    return value.uuid === uuid ? ob : { ...ob, [key]: value };
  });
  res.send();
};

const getPoll = (req, res) => {
  const pointsUUIDS = req.query.p instanceof Array ? req.query.p : [req.query.p] || [];
  res.status(200).send({
    ts: Date.now(),
    data: {
      pointsValues: pointsUUIDS.reduce((ob, nextUUID) => {
        let value = 2;
        let ts = Date.now();
        if (points[nextUUID]) {
          value = points[nextUUID].value();
        }
        return { ...ob, [nextUUID]: { value, ts } };
      }, {}),
    },
  });
};

// POST method
const getPollV2 = (req, res) => {
  const pointsUUIDS = req.body.points instanceof Array ? req.body.points : [req.query.points] || [];
  res.status(200).send({
    ts: Date.now(),
    data: {
      pointsValues: pointsUUIDS.reduce((ob, nextUUID) => {
        let value = 2;
        let ts = Date.now();
        if (points[nextUUID]) {
          value = points[nextUUID].value();
        }
        return { ...ob, [nextUUID]: { value, ts } };
      }, {}),
    },
  });
};

const setpoint = (req, res) => {
  const { uuid, value } = req.body;
  setTimeout(
    () =>
      res.status(200).send({
        ts: Date.now(),
        value,
      }),
    2000
  );
};

const getPoints = (req, res) => {
  const pointsUUIDS = req.query.p instanceof Array ? req.query.p : [req.query.p] || [];
  const _points = [...pointsUUIDS].map((uuid) => (points[uuid] ? points[uuid] : null));
  setTimeout(() => res.status(200).send({ points: _points.filter((point) => !!point) }), 1000);
};

// POST
const getPointsV2 = (req, res) => {
  const pointsUUIDS = req.body.points instanceof Array ? req.body.points : [req.body.points] || [];
  const _points = [...pointsUUIDS].map((uuid) => (points[uuid] ? points[uuid] : null));
  setTimeout(() => res.status(200).send({ points: _points.filter((point) => !!point) }), 1000);
};

const testDevice = (req, res) => {
  const FAILURE_RATIO = 0.2;
  const success = Math.random() > FAILURE_RATIO;
  const { code } = req.params;
  const device = {
    code: req.params.code,
    firmware: `1.0${Math.round(10 * Math.random())}`,
    softinfo: "Some soft info",
    model: "ELP11R32-V(H)",
  };
  tested_devices[code] = device;
  success
    ? setTimeout(() => {
        res.send({
          device,
        });
      }, 8000)
    : setTimeout(() => {
        res.status({ device: null, notFound: true });
      }, 4000);
};

const getDataPoints = (req, res) => {
  res.send({
    points: Object.entries(points).map(([key, { uuid, name, registerName }]) => ({
      uuid,
      name: name || registerName,
    })),
  });
};

const getSettablePoints = (req, res) => {
  res.status(200).send({
    points: Object.entries(points)
      .filter((point) => point.settable === true)
      .map(([key, { uuid, name }]) => ({
        uuid,
        name,
      })),
  });
};

module.exports = {
  useDevices: (router) => {
    router.get("/devices", getDevices);
    router.get("/device/:uuid", getDevice);
    router.post("/device", addDevice);
    router.put("/device/:uuid", updateDevice);
    router.delete("/device/:uuid", removeDevice);
    router.get("/device/:uuid/registers", getDeviceRegisters);
    router.get("/device/test/:code", testDevice);
    router.get("/building/:uuid/settable-points", getSettablePoints);
    router.get("/points/", getPoints);
    router.post("/points/", getPointsV2);
    router.post("/device/:uuid/points", addDevicesPoints);
    router.put("/point/:uuid", updateDevicePoint);
    router.delete("/point/:uuid", deleteDevicePoint);
    router.get("/poll", getPoll);
    router.post("/poll", getPollV2);
    router.put("/poll/setpoint/", setpoint);
    router.get("/data/points", getDataPoints);
  },
  points,
  devices,
};

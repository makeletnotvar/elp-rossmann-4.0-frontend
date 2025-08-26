/* eslint-disable no-dupe-keys */
/* eslint-disable eqeqeq */
/* eslint-disable default-case */
export class VirtualHmiElements {
	constructor() {
		this.VisualType = {
			Fixed: 0x00,
			Hex: 0x01,
			Decimal: 0x02,
			Enums: 0x03,
			RadioBoxes: 0x04,
			CheckBoxes: 0x05,
			Digital: 0x06,
		};
	}

	yearly(buffer) {
		let elementData = { payload: { element: {} } };
		elementData.payload.element.name =
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '-' + this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '  ';
		elementData.payload.element.name +=
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			':' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			'.' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			'  -  ';
		elementData.payload.element.name +=
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '-' + this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '  ';
		elementData.payload.element.name +=
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			':' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			'.' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2);
		return elementData.payload.element.name;
	}

	monthly(buffer) {
		let elementData = { payload: { element: {} } };
		elementData.payload.element.name = this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '  ';
		elementData.payload.element.name +=
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			':' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			'.' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			'  -  ';
		elementData.payload.element.name += this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '  ';
		elementData.payload.element.name +=
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			':' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			'.' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2);
		return elementData.payload.element.name;
	}

	weekly(buffer) {
		let elementData = { payload: { element: {} } };

		elementData.payload.element.name = this.decodeStringFromBuff(buffer) + ' ';
		elementData.payload.element.name +=
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			':' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			'.' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			'  -  ';
		elementData.payload.element.name += this.decodeStringFromBuff(buffer) + ' ';
		elementData.payload.element.name +=
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			':' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			'.' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2);

		return elementData.payload.element.name;
	}

	daily(buffer) {
		let elementData = { payload: { element: {} } };

		elementData.payload.element.name =
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			':' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2) +
			'.' +
			this.addPreviousChar(buffer.shift().toString(16), '0', 2);
		buffer.shift();
		buffer.shift();
		buffer.shift();

		return elementData.payload.element.name;
	}

	systemInfo(buffer, hmiDataLength) {
		let elementData = { type: '', payload: { element: {}, index: 0 } };

		elementData.payload.element.itemText = `${buffer.shift()}.${buffer.shift()} `;
		elementData.payload.element.itemText += `${this.addPreviousChar(buffer.shift(), '0', 2)}`;
		elementData.payload.element.itemText += `-${this.addPreviousChar(buffer.shift(), '0', 2)}`;
		elementData.payload.element.itemText += `-${this.addPreviousChar(buffer.shift(), '0', 2)} `;
		for (var i = 0; i < 11; i++) {
			let data = buffer.shift();
			if (data != 0x00 && data != 0xff) {
				elementData.payload.element.itemText += String.fromCharCode(data);
			}
		}
		elementData.type = 'SystemInfoItem';
		elementData.payload.index = hmiDataLength;

		return { elementData };
	}

	register(buffer, hmiDataLength) {
		let elementData = { type: '', payload: { element: {}, index: 0 } };

		buffer.shift();
		buffer.shift();
		elementData.payload.element.value = this.decodeValueFromBuff(buffer);
		elementData.payload.element.regName = this.decodeStringFromBuff(buffer);
		elementData.payload.element.isEditable = buffer.shift();
		elementData.payload.element.visualType = buffer.shift();
		if ((elementData.payload.element.visualType & 0x0f) == this.VisualType.Fixed) {
			elementData.payload.element.noDotAfter = buffer.shift();
		}
		if (
			(elementData.payload.element.visualType & 0x0f) == this.VisualType.Fixed ||
			(elementData.payload.element.visualType & 0x0f) == this.VisualType.Hex ||
			(elementData.payload.element.visualType & 0x0f) == this.VisualType.Decimal
		) {
			elementData.payload.element.unit = this.decodeStringFromBuff(buffer);
			elementData.payload.element.unstable = this.decodeStringFromBuff(buffer);
			elementData.payload.element.minValue = this.convertRegisterValueToString(
				this.decodeValueFromBuff(buffer),
				elementData.payload.element.visualType,
				elementData.payload.element.noDotAfter
			);
			elementData.payload.element.maxValue = this.convertRegisterValueToString(
				this.decodeValueFromBuff(buffer),
				elementData.payload.element.visualType,
				elementData.payload.element.noDotAfter
			);
			elementData.payload.element.incValue = this.convertRegisterValueToString(
				this.decodeValueFromBuff(buffer),
				elementData.payload.element.visualType,
				elementData.payload.element.noDotAfter
			);
			elementData.payload.element.stringValue = this.convertRegisterValueToString(
				elementData.payload.element.value,
				elementData.payload.element.visualType,
				elementData.payload.element.noDotAfter
			);
			if (elementData.payload.element.isEditable) {
				elementData.payload.element.value = parseFloat(elementData.payload.element.stringValue);
			}
			elementData.type = 'RegisterValueItem';
			elementData.payload.index = hmiDataLength;
		} else if ((elementData.payload.element.visualType & 0x0f) == this.VisualType.Enums) {
			elementData.payload.element.enumValue = this.decodeStringFromBuff(buffer);
			elementData.payload.element.items = {};
			let itemsCount = buffer.shift();
			for (let i = 0; i < itemsCount; i++) {
				let hmiItem = {};
				hmiItem.value = this.decodeValueFromBuff(buffer);
				hmiItem.name = this.decodeStringFromBuff(buffer);
				elementData.payload.element.items[hmiItem.value] = hmiItem.name;
			}
			elementData.type = 'RegisterEnumItem';
			elementData.payload.index = hmiDataLength;
		} else if ((elementData.payload.element.visualType & 0x0f) == this.VisualType.CheckBoxes) {
			elementData.payload.element.bits = buffer.shift();
			elementData.type = 'RegisterCheckboxesItem';
			elementData.payload.index = hmiDataLength;
		} else if ((elementData.payload.element.visualType & 0x0f) == this.VisualType.RadioBoxes) {
			elementData.payload.element.bits = buffer.shift();
		} else if ((elementData.payload.element.visualType & 0x0f) == this.VisualType.Digital) {
			elementData.payload.element.bits = buffer.shift();
			elementData.type = 'RegisterDigitalItem';
			elementData.payload.index = hmiDataLength;
		}

		return { elementData };
	}

	time(buffer, hmiDataLength) {
		let elementData = { type: '', payload: { element: {}, index: 0 } };

		elementData.payload.element.itemText = '';
		elementData.payload.element.itemText += this.addPreviousChar(buffer.shift().toString(16), '0', 2) + ':';
		elementData.payload.element.itemText += this.addPreviousChar(buffer.shift().toString(16), '0', 2) + ':';
		elementData.payload.element.itemText += this.addPreviousChar(buffer.shift().toString(16), '0', 2);
		elementData.payload.element.isEditable = buffer.shift();
		elementData.type = 'TimeItem';
		elementData.payload.index = hmiDataLength;

		return { elementData };
	}

	date(buffer, hmiDataLength) {
		let elementData = { type: '', payload: { element: {}, index: 0 } };

		elementData.payload.element.itemText = '';
		elementData.payload.element.itemText = this.decodeStringFromBuff(buffer);
		buffer.shift();
		elementData.payload.element.itemText = this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '-';
		elementData.payload.element.itemText += this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '-';
		elementData.payload.element.itemText += this.addPreviousChar(buffer.shift().toString(16), '0', 2);
		elementData.payload.element.isEditable = buffer.shift();
		elementData.type = 'DateMultiItem';
		elementData.payload.index = hmiDataLength;

		return { elementData };
	}

	dateDD(buffer, hmiDataLength) {
		let elementData = { type: '', payload: { element: {}, index: 0 } };

		elementData.payload.element.itemText = '';
		elementData.payload.element.itemText = this.addPreviousChar(buffer.shift().toString(16), '0', 2);
		elementData.payload.element.isEditable = buffer.shift();
		elementData.type = 'DateMultiItem';
		elementData.payload.index = hmiDataLength;

		return { elementData };
	}

	dateDDMM(buffer, hmiDataLength) {
		let elementData = { type: '', payload: { element: {}, index: 0 } };

		elementData.payload.element.itemText = '';
		elementData.payload.element.itemText = this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '-';
		elementData.payload.element.itemText += this.addPreviousChar(buffer.shift().toString(16), '0', 2);
		elementData.payload.element.isEditable = buffer.shift();
		elementData.type = 'DateMultiItem';
		elementData.payload.index = hmiDataLength;

		return { elementData };
	}

	dateDDMMYY(buffer, hmiDataLength) {
		let elementData = { type: '', payload: { element: {}, index: 0 } };

		elementData.payload.element.itemText = '';
		elementData.payload.element.itemText = this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '-';
		elementData.payload.element.itemText += this.addPreviousChar(buffer.shift().toString(16), '0', 2) + '-';
		elementData.payload.element.itemText += this.addPreviousChar(buffer.shift().toString(16), '0', 2);
		elementData.payload.element.isEditable = buffer.shift();
		elementData.type = 'DateMultiItem';
		elementData.payload.index = hmiDataLength;

		return { elementData };
	}

	password(buffer, hmiDataLength) {
		let elementData = { type: '', payload: { element: {}, index: 0 } };

		elementData.payload.element.passwordLength = buffer.shift();
		elementData.type = 'PasswordItem';
		elementData.payload.index = hmiDataLength;

		return { elementData };
	}

	default(hmiDataLength) {
		let elementData = { type: '', payload: { element: {}, index: 0 } };

		elementData.type = 'TextItem';
		elementData.payload.index = hmiDataLength;

		return { elementData };
	}

	addPreviousChar(stringIn, charToAdd, outStringLength) {
		stringIn = stringIn.toString();
		while (stringIn.length < outStringLength) stringIn = charToAdd + stringIn;
		return stringIn;
	}

	decodeStringFromBuff(buffer) {
		let string = '';
		let j = buffer.shift();
		for (let i = 0; i < j; i++) {
			string += String.fromCharCode(buffer.shift());
		}
		return this.replaceSpecialChars(string);
	}

	decodeValueFromBuff(buffer) {
		let tempValue = buffer.shift();
		tempValue += buffer.shift() << 8;
		tempValue += buffer.shift() << 16;
		tempValue += buffer.shift() << 24;
		return tempValue;
	}

	convertRegisterValueToString(val, visualType, noDotAfter) {
		if (visualType == this.VisualType.Fixed) {
			return (val / 256).toFixed(noDotAfter);
		} else if (visualType == this.VisualType.Hex) {
			return this.addPreviousChar(val.toString(16), '0', 2);
		} else if (visualType == this.VisualType.Decimal) {
			return val;
		}
	}

	replaceSpecialChars(stringIn) {
		let charCodeTable = {
			0x01: 0x119,
			0x02: 0x0f3,
			0x03: 0x105,
			0x04: 0x15b,
			0x05: 0x142,
			0x06: 0x17c,
			0x06: 0x17a,
			0x07: 0x107,
			0x08: 0x144,
			0x01: 0x118,
			0x02: 0x0d3,
			0x03: 0x104,
			0x04: 0x15a,
			0x05: 0x141,
			0x06: 0x17b,
			0x06: 0x179,
			0x07: 0x106,
			0x08: 0x143,
			0xdf: 0x0b0,
			0xa6: 0x419,
			0xe1: 0x426,
			0xa9: 0x423,
			0x4b: 0x41a,
			0x45: 0x415,
			0x48: 0x41d,
			0xa1: 0x413,
			0xac: 0x428,
			0xe2: 0x429,
			0xa4: 0x417,
			0x58: 0x425,
			0xad: 0x42a,
			0xaa: 0x424,
			0xae: 0x42b,
			0x42: 0x412,
			0x41: 0x410,
			0xa8: 0x41f,
			0x50: 0x420,
			0x4f: 0x41e,
			0xa7: 0x41b,
			0xe0: 0x414,
			0xa3: 0x416,
			0xaf: 0x42d,
			0xb1: 0x42f,
			0xab: 0x427,
			0x43: 0x421,
			0x4d: 0x41c,
			0xa5: 0x418,
			0x54: 0x422,
			0x62: 0x42c,
			0xa0: 0x411,
			0xb0: 0x42e,
			0xa2: 0x401,
			0xb9: 0x439,
			0xe5: 0x446,
			0x79: 0x443,
			0xba: 0x43a,
			0x65: 0x435,
			0xbd: 0x43d,
			0xb4: 0x433,
			0xc1: 0x448,
			0xe6: 0x449,
			0xb7: 0x437,
			0x78: 0x445,
			0xc2: 0x44a,
			0xe4: 0x444,
			0xc3: 0x44b,
			0xb3: 0x432,
			0x61: 0x430,
			0xbe: 0x43f,
			0x70: 0x440,
			0x6f: 0x43e,
			0xbb: 0x43b,
			0xe3: 0x434,
			0xb6: 0x436,
			0xc5: 0x44d,
			0xc7: 0x44f,
			0xc0: 0x447,
			0x63: 0x441,
			0xbc: 0x43c,
			0xb8: 0x438,
			0xbf: 0x442,
			0xc4: 0x44c,
			0xb2: 0x431,
			0xc6: 0x44e,
			0xb5: 0x451,
		};

		for (let i = 0; i < stringIn.length; i++) {
			let chCode = stringIn.charCodeAt(i);
			if (chCode <= 0x10 || chCode >= 0x80) {
				if (charCodeTable[chCode]) {
					stringIn = stringIn.substring(0, i) + String.fromCharCode(charCodeTable[chCode]) + stringIn.substr(i + 1);
				}
			}
		}
		return stringIn;
	}
}

export class VirtualHmi {
	constructor() {
		this.webSocket = new VirtualHmiWebsocket(
			this.webSocketCallbackConnect.bind(this),
			this.webSocketCallbackClose.bind(this),
			this.webSocketCallbackGetMessage.bind(this),
			this.webSocketCallbackError.bind(this)
		);
		this.hmiGetElementData = new VirtualHmiElements();
		this.webSocketCallback = null;
		this.appIntervalTimer = -1;
		this.packetId = 0;
		this.receivedBuff = [];
		this.hmiElements = [];
		this.currentPath = [];
		this.dataChangeCallback = null;
		this.device = { id: null, isOnline: false };
		this.userUUID = null;
		this.hashCode = null;
		this.userIsAdmin = 0x10;
		this.ItemType = {
			Node: 0x01,
			Register: 0x02,
			Time: 0x03,
			Date: 0x04,
			SystemInfo: 0x40,
			CalendarItem: 0x09,
			CalNew: 0x08,
			DateDDMM2: 0x85,
			DateDD: 0x86,
			DateDoW: 0x87,
			DateDDMM: 0x05,
			DateDDMMYY: 0x06,
			Timehhmmss: 0x07,
			Temp: 0x0f,
			Language: 0x10,
			Password: 0x20,
			RestoreDefault: 0x30,
			Calendar: 0x80,
			Calendar_Yearly: 0x10,
			Calendar_Monthly: 0x20,
			Calendar_Weekly: 0x30,
			Calendar_Daily: 0x40,
		};
		this.CalendarItemType = {
			Yearly: 0x01,
			Monthly: 0x02,
			Weekly: 0x03,
			Daily: 0x04,
		};
	}

	connect(deviceId, userUUID = null, hashCode = null) {
		if (deviceId == '' || deviceId.length != 24 || hashCode.length != 64) return;
		this.device.id = deviceId;
		this.userUUID = userUUID;
		this.hashCode = hashCode;
		this.webSocket.webSocketConnect();
		this.appIntervalTimer = setTimeout(this.appInterval.bind(this), 1000);
	}

	disconnect() {
		this.device.id = null;
		this.userUUID = null;
		this.hashCode = null;
		this.dataChangeCallback([]);
		setTimeout(() => {
			this.webSocket.webSocketDisconnect();
			clearTimeout(this.appIntervalTimer);
		}, 1000);
	}

	setDataChangeCallback(dataChangeCallback) {
		this.dataChangeCallback = dataChangeCallback;
	}

	sendToDevice(command, callback = null) {
		this.webSocketCallback = callback;
		this.webSocket.webSocketSend({
			dest: 'DEVICE',
			command,
			devId: this.device.id,
			pid: ++this.packetId,
		});
	}

	onChangeNodePath(path) {
		const pathWithoutFirstPath = path.slice(1);
		const firstPath = path[0] ? 0x00 + path[0] : 0x00;
		const packet = [0x73, firstPath, ...pathWithoutFirstPath];
		this.currentPath = pathWithoutFirstPath;
		this.sendToDevice(packet);
	}

	deviceChangeValue(data, overwriteVal = null) {
		const { value, index, type } = data;
		const packet = [0x66 + this.userIsAdmin, type, this.currentPath.length + 1, ...this.currentPath, index];
		let newValue = parseInt(value);
		if (overwriteVal !== null) newValue = overwriteVal;
		newValue >>>= 0;
		packet.push(newValue & 0xff);
		newValue >>>= 8;
		packet.push(newValue & 0xff);
		newValue >>>= 8;
		packet.push(newValue & 0xff);
		newValue >>>= 8;
		packet.push(newValue & 0xff);
		this.sendToDevice(packet);
	}

	deviceChangeCheckboxesValue(data) {
		const { value, checked } = data;
		let newValue = value;
		if (checked) {
			newValue += parseInt(value);
		} else {
			newValue -= parseInt(value);
		}

		this.deviceChangeValue(data, newValue);
	}

	deviceSendRegisterValue(data) {
		const { value, visualType, minValue, maxValue } = data;
		let newVal = parseFloat(value);

		if (isNaN(newVal)) newVal = parseFloat(minValue);
		if (newVal > parseFloat(maxValue)) newVal = parseFloat(maxValue);
		if (newVal < parseFloat(minValue)) newVal = parseFloat(minValue);
		if (visualType == this.hmiGetElementData.VisualType.Fixed) {
			newVal *= 256;
			newVal >>>= 0;
		}

		this.deviceChangeValue(data, newVal);
	}

	deviceSendDigitalValue(data) {
		const { value } = data;
		let newValue = value;
		if (newValue < 0) newValue *= -1;
		this.deviceChangeValue(data, newValue);
	}

	deviceSendDate(data) {
		const { value, index, type } = data;
		let newValue = value;
		if (newValue.length < 5 || newValue.length > 8) return;
		const registerFullTime = /^\d{1,2}-\d{1,2}-\d{1,2}$/;
		const registerTime = /^\d{1,2}-\d{1,2}$/;
		if (registerFullTime.test(newValue) || registerTime.test(newValue)) {
			if (registerTime.test(newValue)) newValue += '-0';
			const [day, month, year] = newValue.split('-');
			let dateDay = null;
			if (type == 4) {
				dateDay = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day)).getDay();
			}
			const packet = [
				0x66 + this.userIsAdmin,
				type,
				this.currentPath.length + 1,
				...this.currentPath,
				index,
				dateDay,
				parseInt(day, 16),
				parseInt(month, 16),
				parseInt(year, 16),
			].filter(packet => packet !== null);
			this.sendToDevice(packet);
		}
	}

	deviceSendTime(data) {
		const { value, index, type } = data;
		let newValue = value;
		if (newValue.length < 5 || newValue.length > 8) return;
		var regFullTime = /^\d{1,2}:\d{1,2}:\d{1,2}$/;
		var regTime = /^\d{1,2}:\d{1,2}$/;
		if (regFullTime.test(newValue) || regTime.test(newValue)) {
			if (regTime.test(newValue)) newValue += ':0';
			const [hours, minutes, seconds] = newValue.split(':');
			let packet = [
				0x66 + this.userIsAdmin,
				type,
				this.currentPath.length + 1,
				...this.currentPath,
				index,
				parseInt(hours, 16),
				parseInt(minutes, 16),
				parseInt(seconds, 16),
			];
			this.sendToDevice(packet);
		}
	}

	deviceSendPassword(password) {
		const passwordCharCodeAt = [...password].map(char => char.charCodeAt());
		const packet = [0x66 + this.userIsAdmin, 0x20, password.length, ...passwordCharCodeAt];
		this.sendToDevice(packet);
	}

	deviceGetMenu() {
		this.receivedBuff = [];
		const packet = [0x73, this.currentPath.length, ...this.currentPath];
		this.sendToDevice(packet);
	}

	deviceGetNextPartMenu() {
		const packet = [0x64 + this.userIsAdmin];
		this.sendToDevice(packet);
	}

	calculateCrc(buffer, length) {
		let crc = 0xffff;
		for (let i = 0; i < length; i++) {
			crc = crc ^ buffer[i];
			for (let j = 0; j < 8; j++) {
				if ((crc & 1) == 1) {
					crc = (crc >> 1) ^ 0xa001;
				} else {
					crc >>= 1;
				}
			}
		}
		return crc;
	}

	decodeDeviceElement(buffer) {
		let hmiElementsData = [];
		while (buffer.length) {
			let hmiElementData = { type: '', payload: { element: {}, index: 0 } };
			let type = buffer.shift();
			hmiElementData.payload.element.type = type;
			if ((type & 0x7f) == this.ItemType.CalendarItem) {
				let calendarType = buffer.shift();
				switch (calendarType) {
					case this.CalendarItemType.Yearly:
						hmiElementData.payload.element.name = this.hmiGetElementData.yearly(buffer, hmiElementsData.length);
						break;
					case this.CalendarItemType.Monthly:
						hmiElementData.payload.element.name = this.hmiGetElementData.monthly(buffer, hmiElementsData.length);
						break;
					case this.CalendarItemType.Weekly:
						hmiElementData.payload.element.name = this.hmiGetElementData.weekly(buffer, hmiElementsData.length);
						break;
					case this.CalendarItemType.Daily:
						hmiElementData.payload.element.name = this.hmiGetElementData.daily(buffer, hmiElementsData.length);
						break;
				}
				const { elementData } = this.hmiGetElementData.default(hmiElementsData.length);
				hmiElementData.payload.element = { ...hmiElementData.payload.element, ...elementData.payload.element };
				hmiElementData.payload.index = elementData.payload.index;
				hmiElementData.type = elementData.type;
			} else {
				hmiElementData.payload.element.name = this.hmiGetElementData.decodeStringFromBuff(buffer);
				switch (type) {
					case this.ItemType.SystemInfo: {
						const { elementData } = this.hmiGetElementData.systemInfo(buffer, hmiElementsData.length);
						hmiElementData.payload.element = { ...hmiElementData.payload.element, ...elementData.payload.element };
						hmiElementData.payload.index = elementData.payload.index;
						hmiElementData.type = elementData.type;
						break;
					}
					case this.ItemType.Register:
					case this.ItemType.Register | 0x80: {
						const { elementData } = this.hmiGetElementData.register(buffer, hmiElementsData.length);
						hmiElementData.payload.element = { ...hmiElementData.payload.element, ...elementData.payload.element };
						hmiElementData.payload.index = elementData.payload.index;
						hmiElementData.type = elementData.type;
						break;
					}
					case this.ItemType.Time:
					case this.ItemType.Time | 0x80:
					case this.ItemType.Timehhmmss: {
						const { elementData } = this.hmiGetElementData.time(buffer, hmiElementsData.length);
						hmiElementData.payload.element = { ...hmiElementData.payload.element, ...elementData.payload.element };
						hmiElementData.payload.index = elementData.payload.index;
						hmiElementData.type = elementData.type;
						break;
					}
					case this.ItemType.DateDD: {
						const { elementData } = this.hmiGetElementData.dateDD(buffer, hmiElementsData.length);
						hmiElementData.payload.element = { ...hmiElementData.payload.element, ...elementData.payload.element };
						hmiElementData.payload.index = elementData.payload.index;
						hmiElementData.type = elementData.type;
						break;
					}
					case this.ItemType.DateDDMM2:
					case this.ItemType.DateDDMM: {
						const { elementData } = this.hmiGetElementData.dateDDMM(buffer, hmiElementsData.length);
						hmiElementData.payload.element = { ...hmiElementData.payload.element, ...elementData.payload.element };
						hmiElementData.payload.index = elementData.payload.index;
						hmiElementData.type = elementData.type;
						break;
					}
					case this.ItemType.DateDDMMYY: {
						const { elementData } = this.hmiGetElementData.dateDDMMYY(buffer, hmiElementsData.length);
						hmiElementData.payload.element = { ...hmiElementData.payload.element, ...elementData.payload.element };
						hmiElementData.payload.index = elementData.payload.index;
						hmiElementData.type = elementData.type;
						break;
					}
					case this.ItemType.Date:
					case this.ItemType.Date | 0x80: {
						const { elementData } = this.hmiGetElementData.date(buffer, hmiElementsData.length);
						hmiElementData.payload.element = { ...hmiElementData.payload.element, ...elementData.payload.element };
						hmiElementData.payload.index = elementData.payload.index;
						hmiElementData.type = elementData.type;
						break;
					}
					case this.ItemType.Password: {
						const { elementData } = this.hmiGetElementData.password(buffer, hmiElementsData.length);
						hmiElementData.payload.element = { ...hmiElementData.payload.element, ...elementData.payload.element };
						hmiElementData.payload.index = elementData.payload.index;
						hmiElementData.type = elementData.type;
						break;
					}
					default: {
						const { elementData } = this.hmiGetElementData.default(hmiElementsData.length);
						hmiElementData.payload.element = { ...hmiElementData.payload.element, ...elementData.payload.element };
						hmiElementData.payload.index = elementData.payload.index;
						hmiElementData.type = elementData.type;
						break;
					}
				}
			}
			hmiElementsData.push(hmiElementData);
		}

		this.receivedBuff = [];
		return hmiElementsData;
	}

	deviceGetElements() {
		if (this.receivedBuff.length > 0) {
			this.hmiElements = this.decodeDeviceElement(this.receivedBuff);
			if (this.hmiElements.length > 0) {
				this.dataChangeCallback(this.hmiElements);
			}
		}
	}

	checkReceivedBuffer(buffer) {
		let crc = this.calculateCrc(buffer, buffer.length - 2);
		if ((crc & 0xff) == buffer[buffer.length - 2] && crc >> 8 == buffer[buffer.length - 1]) {
			return buffer.slice(1, buffer.length - 2);
		}
		return false;
	}

	deviceReceivedData(receivedData) {
		receivedData = this.checkReceivedBuffer(receivedData);
		if (receivedData) {
			switch (receivedData[0]) {
				case 0x63:
				case 0x73:
					this.receivedBuff = this.receivedBuff.concat(receivedData.slice(2));
					if (receivedData[1] == 0x00) {
						this.currentPath.pop();
						this.currentPath.pop();
						this.deviceGetMenu();
					} else {
						this.deviceGetElements();
					}
					break;
				case 0x64:
				case 0x74:
					this.receivedBuff = this.receivedBuff.concat(receivedData.slice(2));
					this.deviceGetNextPartMenu();
					break;
				case 0x66:
				case 0x76:
					this.deviceGetMenu();
					break;
				default:
					break;
			}
		}
		return receivedData;
	}

	webSocketCallbackConnect() {
		if (!this.device.id) return;
		this.webSocket.webSocketSend({
			dest: 'SERVER',
			command: 'IS_ONLINE',
			devId: this.device.id,
			userUUID: this.userUUID,
			connectionHash: this.hashCode,
		});
		this.device.isOnline = true;
	}

	webSocketCallbackClose() {}

	webSocketCallbackError() {}

	webSocketCallbackGetMessage(data) {
		try {
			let serverMessage = JSON.parse(data);
			if (serverMessage.answer.error == null) {
				switch (serverMessage.dest) {
					case 'DEVICE':
						if (serverMessage.pid == this.packetId) {
							if (this.webSocketCallback) {
								this.webSocketCallback(serverMessage.answer.message, {
									message: serverMessage.answer.message,
								});
							} else {
								this.deviceReceivedData(serverMessage.answer.message);
							}
						}
						break;
					default:
						break;
				}
			} else {
				switch (serverMessage.answer.error) {
					case 'OFFLINE':
						this.device.isOnline = false;
						break;
					default:
						break;
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	appInterval() {
		this.appIntervalTimer = setTimeout(this.appInterval.bind(this), 10000);
		this.deviceGetMenu();
	}
}

export class VirtualHmiWebsocket {
	constructor(connect = null, close = null, message = null, error = null) {
		this.urlConnection = import.meta.env.VITE_APP_VIRTUAL_HMI_URL;
		this.connected = false;
		this.webSocketConnection = null;
		this.callbackOnConnect = connect;
		this.callbackOnClose = close;
		this.callbackOnMessage = message;
		this.callbackOnError = error;
	}

	webSocketConnect() {
		try {
			this.webSocketConnection = new WebSocket(this.urlConnection);
			this.webSocketConnection.onopen = function () {
				this.connected = true;
				if (this.callbackOnConnect) this.callbackOnConnect();
			}.bind(this);

			this.webSocketConnection.onclose = function () {
				this.connected = false;
				if (this.callbackOnClose) this.callbackOnClose();
			}.bind(this);

			this.webSocketConnection.onerror = function (evt) {
				this.connected = false;
				if (this.callbackOnError) this.callbackOnError(evt.data);
			}.bind(this);

			this.webSocketConnection.onmessage = function (evt) {
				if (this.callbackOnMessage) this.callbackOnMessage(evt.data);
			}.bind(this);
		} catch (error) {
			console.log(error);
		}
	}

	webSocketDisconnect() {
		this.webSocketConnection.close();
		delete this.webSocketConnection;
	}

	webSocketSend(data) {
		if (this.connected) this.webSocketConnection.send(JSON.stringify(data));
	}
}

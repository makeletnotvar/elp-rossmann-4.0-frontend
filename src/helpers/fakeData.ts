import fakeUUID from "helpers/fakeUUID";

type FakeDataParamType = 'city' | 'province' | 'address' | 'uuid' | 'code' | 'boolean' | 'temperature' | 'point' | any[]

interface FakeDataModel {
    [param: string]: FakeDataParamType;
}

const randArr = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];


export const getRandomParam = (type: FakeDataParamType) => {

    switch (type as FakeDataParamType) {
        case 'uuid':
            return fakeUUID();
        case 'code':
            return `A${Math.round(Math.random() * 1000)}`;
        case 'city':
            return randArr(['Warszawa', 'Wroclaw', 'Białystok', 'Oleśnica', 'Kraków', 'Poznań', 'Słupsk', 'Gdańsk', 'Szczecin', 'Gdynia', 'Gorzów wlkp', 'Koszalin']);
        case 'province':
            return randArr(['dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie', 'łódzkie', 'małopolskie', 'mazowieckie', 'opolskie', 'podkarpackie', 'podlaskie', 'pomorskie', 'śląskie', 'świętokrzyskie', 'warmińsko-mazurskie', 'wielkopolskie', 'zachodniopomorskie']);
        case 'address':
            return randArr(['Kolejowa', 'Wrocławska', 'Fabryczna', 'Korkowa', 'Zielona', 'Ogrodowa', 'Długa', 'Piłsudskiego']) + ' ' + Math.ceil(Math.random() * 150);
        case 'boolean':
            return Math.random() > 0.5;
        case 'temperature':
            return 19 + Math.random() * 3.5;
        case 'point':
            return fakeUUID();
        default:
            return 0;
    }

}

export const generateFakeData = <T>(model: FakeDataModel, count: number): T[] => {
    const data = [];

    for (let i = 0; i < count; i++) {
        let item = {};

        Object
            .keys(model)
            .forEach(
                key => {
                    const type = model[key];
                    let value = '';
                    if (type instanceof Array) {
                        value = randArr(type as any[]);
                    } else {
                        value = getRandomParam(type);
                    }
                    (item as any)[key] = value;
                }
            )

        data.push(item);
    }

    return data as T[];
}


export const duplicateArray = <T = any>(arr: T[], n: number = 2): T[] => {
    let output: T[] = [];

    for (let i = 0; i < n; i++) {
        output = [...output, ...arr];
    }

    return output;
}
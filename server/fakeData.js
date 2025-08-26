const fakeUUID = () => Math.random().toString(32).substring(2);
const randArr = (arr) => arr[Math.floor(Math.random() * arr.length)];


const getRandomParam = (type) => {
    switch (type) {
        case 'uuid':
            return fakeUUID();
        case 'code':
            return `A${Math.round(Math.random()*1000)}`;
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
            return type;
    }

}

const generateFakeData = (model, count) => {
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
                        value = randArr(type);
                    } else {
                        value = getRandomParam(type);
                    }
                    (item)[key] = value;
                }
            )

        data.push(item);
    }

    return data;
}

module.exports = {
    generator: generateFakeData,
    fakeUUID,
    randArr
}
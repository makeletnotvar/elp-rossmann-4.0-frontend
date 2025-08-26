import config from './config';
import axios from 'axios';

export const createUrl = (url: string) => {
    return `${config.URL}${url}`;
};

const GENERAL_AXIOS_SETTINGS = {
    method:             'GET', // *GET, POST, PUT, DELETE, etc.
    mode:               'no-cors', // no-cors, cors, *same-originp
    cache:              'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials:        'same-origin', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect:           'follow', // manual, *follow, error
    referrer:           'no-referrer', // no-referrer, *client
};

function getSettings (method: 'GET' | 'POST' | 'PUT' | 'DELETE', settings: any = {}, body = {}) {
    return {
        ...GENERAL_AXIOS_SETTINGS,
        ...(body ? { body } : {}),
        ...settings,
        ...{ method },
    }
}

export const ajax = {
    get: (url: string, settings = {}) => axios.get(url, getSettings('GET', settings)),
    post: (url: string, body = {}, settings = {}) => axios.post(url, getSettings('POST', settings, body)),
    put: (url: string, settings = {}) => axios.get(url, getSettings('PUT', settings)),
    delete: (url: string, settings = {}) => axios.get(url, getSettings('DELETE', settings)),
};

export default {};
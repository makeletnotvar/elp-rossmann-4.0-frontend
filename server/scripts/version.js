const { writeFileSync, readFileSync } = require("fs");

const VERSION_FILE = '../../version.json';

function readVersion() {
    let str = null;
    let json = {};

    try {
        const file = readFileSync(VERSION_FILE);
        str = file.toString();
        json = JSON.parse(str);
    } catch(err) {
        console.log(err);
    } 

    return json;
}

function createNextVersion(versionString){
    const [a,b,_c] = versionString.split('.');
    const c = parseInt(_c) + 1;
    return `${a}.${b}.${c}`;
}

function createDate(){
    const date = new Date();
    const dateString = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`;
    return dateString;
}

function save(json){
    writeFileSync(VERSION_FILE, JSON.stringify(json, null, 2));
}

function updateVersion(){
    const currentVersionJSON = readVersion();
    console.log(currentVersionJSON, currentVersionJSON.version)
    const version = createNextVersion(currentVersionJSON.version);
    const build = createDate();
    
    // 
    save({version, build});
}

updateVersion();
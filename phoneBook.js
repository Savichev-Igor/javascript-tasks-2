'use strict';

var regPhone = new RegExp(/(?:^\+{0,1}\d{0,2}\s\d{3}\s\d{3}-{0,1}\d-{0,1}\d{3}$)|(?:^\+\d\s\(\d{3}\)\s\d{3}-{0,1}\s{0,1}\d-{0,1}\s{0,1}\d{3}$)|(?:^\d{11}$)|(?:^\d{3}\s\d{3}-{0,1}\d-{0,1}\d{3}$)/);
var regEmail = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Zа-яА-ЯеЁ0-9\._-]+\.[a-zA-Zа-яеЁА-Я]+$/);

/**
 * Проверяем, валиден ли номер телефона
 * @param {string} phone
 * @return {boolean} true||false
*/
function isPhoneValid(phone) {
    return regPhone.test(phone);
}
/**
 * Проверяем, валиден ли адрес электронной почты
 * @param {string} email
 * @return {boolean} true||false
*/
function isEmailValid(email) {
    return regEmail.test(email);
}

var phoneBook = {};

/**
 * Функция добавления записи в телефонную книгу.
 * @param {string} name
 * @param {string} phone
 * @param {string} email
*/
module.exports.add = function add(name, phone, email) {
    if (typeof name === 'string' && typeof phone === 'string' && typeof email === 'string' && isPhoneValid(phone) && isEmailValid(email)) {
        var key = [name, phone, email].join(' ');
        phoneBook[key] = {'name': name, 'phone': phone, 'email': email};
    }
};

/**
 * Функция получает из словарного значения одну строку для одной записи
 * @param {string} key
 * return {stirng} str
*/
function getOneLine(key) {
    var temp_arr = new Array();
    temp_arr.push(phoneBook[key]['name']);
    temp_arr.push(phoneBook[key]['phone']);
    temp_arr.push(phoneBook[key]['email']);
    return temp_arr.join(' ');
}

/**
 * Функция поиска записи в телефонной книге.
 * @param {string} query
*/
module.exports.find = function find(query) {
    for (var key in phoneBook) {
        if (query === 'undefined') {
            console.log(getOneLine(key));
            continue;
        }
        if (phoneBook[key]['name'].indexOf(query) != -1) {
            console.log(getOneLine(key));
            continue;
        }
        if (phoneBook[key]['phone'].indexOf(query) != -1) {
            console.log(getOneLine(key));
            continue;
        }
        if (phoneBook[key]['email'].indexOf(query) != -1) {
            console.log(getOneLine(key));
            continue;
        }

    }
};

/**
 * Функция удаления записи в телефонной книге.
 * @param {string} query
*/
module.exports.remove = function remove(query) {
    if (query) {
        var counter = 0;
        for (var key in phoneBook) {
            if (key.indexOf(query) != -1) {
                delete phoneBook[key];
                counter += 1;
            }
        }
        console.log('Удалено контактов: ' + counter.toString());
    }
};

/**
 * Функция импорта записей из файла.
 * @param {string} filename
*/
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    data = data.split('\n');
    var params = new Array();
    for (var i = 0; i < data.length; i++) {
        params = data[i].split(';');
        module.exports.add(params[0], params[1], params[2]);
    }
};

/**
  * Вспомогательные функция добивки пробелов.
  * @param {string} str
  * @param {number} len
  * @return {string} str
*/
function writeSpaces(str, len) {
    for (var i = 0; i < len; i++) {
        str += ' ';
    }
    return str;
};

/**
  * Функция вывода всех телефонов в виде ASCII.
*/
module.exports.showTable = function showTable() {
    var maxLenName = 0;
    var maxLenPhone = 0;
    var maxLenEmail = 0;
    var curLen;
    for (var key in phoneBook) {
        curLen = phoneBook[key]['name'].length;
        if (curLen > maxLenName) {
            var maxLenName = curLen;
        }
        curLen = phoneBook[key]['phone'].length;
        if (curLen > maxLenPhone) {
            var maxLenPhone = curLen;
        }
        curLen = phoneBook[key]['email'].length;
        if (curLen > maxLenEmail) {
            var maxLenEmail = curLen;
        }
    }
    maxLenName += 5;
    maxLenPhone += 5;
    maxLenEmail += 5;
    var firstLine = '┌';
    var secondLine = '│';
    var thirdLine = '├';
    var lastLine = '└';
    var all_len = maxLenName + maxLenPhone + maxLenEmail;
    var separator_1 = maxLenName;
    var separator_2 = maxLenName + maxLenPhone;
    for (var i = 0; i < all_len; i++) {
        firstLine += '-';
        thirdLine += '-';
        lastLine += '-';
        if (i == separator_1) {
            firstLine += '┬';
            thirdLine += '┼';
            lastLine += '┴';
        }
        if (i == separator_2) {
            firstLine += '╥';
            thirdLine += '╫';
            lastLine += '╨';
        }
        if (i == all_len - 1) {
            firstLine += '┐';
            thirdLine += '┤';
            lastLine += '┘';
        }
    }
    var nameBlock = '  Имя';
    secondLine += writeSpaces(nameBlock, maxLenName - nameBlock.length + 1) + '│';
    var phoneBlock = '  Телефон';
    secondLine += writeSpaces(phoneBlock, maxLenPhone - phoneBlock.length) + '║';
    var emailBlock = '  email';
    secondLine += writeSpaces(emailBlock, maxLenEmail - emailBlock.length - 1) + '│';
    console.log(firstLine);
    console.log(secondLine);
    console.log(thirdLine);
    for (var key in phoneBook) {
        var newString = '│';
        var personNameBlock = '  ' + phoneBook[key]['name'];
        newString += writeSpaces(personNameBlock, maxLenName - personNameBlock.length + 1) + '│';
        var personPhoneBlock = '  ' + phoneBook[key]['phone'];
        newString += writeSpaces(personPhoneBlock, maxLenPhone - personPhoneBlock.length) + '║';
        var personEmailBlock = '  ' + phoneBook[key]['email'];
        newString += writeSpaces(personEmailBlock, maxLenEmail - personEmailBlock.length - 1) + '│';
        console.log(newString);
    }
    console.log(lastLine);
};

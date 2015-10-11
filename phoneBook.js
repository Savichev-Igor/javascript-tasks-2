'use strict';

var reg_phone = new RegExp(/(?:^\+{0,1}\d{0,2}\s\d{3}\s\d{3}-{0,1}\d-{0,1}\d{3}$)|(?:^\+\d\s\(\d{3}\)\s\d{3}-{0,1}\s{0,1}\d-{0,1}\s{0,1}\d{3}$)|(?:^\d{11}$)|(?:^\d{3}\s\d{3}-{0,1}\d-{0,1}\d{3}$)/);
var reg_email = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Zа-яА-Я0-9\._-]+\.[a-zA-Zа-яА-Я]+$/);

/**
 * Проверяем, валиден ли номер телефона
 * @param {string} phone
 * @return {boolean} true||false
*/
function isPhoneValid(phone) {
    return reg_phone.test(phone);
}
/**
 * Проверяем, валиден ли адрес электронной почты
 * @param {string} email
 * @return {boolean} true||false
*/
function isEmailValid(email) {
    return reg_email.test(email);
}

var phoneBook = {};

/**
 * Функция добавления записи в телефонную книгу.
 * @param {string} name, {string} phone, {string} email
*/
module.exports.add = function add(name, phone, email) {
    if (typeof name === 'string' && typeof phone === 'string' && typeof email === 'string'){
        if (isPhoneValid(phone) && isEmailValid(email)){
            var key = [name, phone, email].join(' ');
            phoneBook[key] = {'name': name, 'phone': phone, 'email': email};
            // console.log(key);
        }
    }

};

/**
 * Функция поиска записи в телефонной книге.
 * @param {string} query
*/
module.exports.find = function find(query) {
    if (query){
        for(var key in phoneBook){
            if (key.indexOf(query) != -1){
                var temp = new Array();
                for (var key_person in phoneBook[key]){
                    temp.push(phoneBook[key][key_person]);
                }
                console.log(temp.join(', '));
            }
        }
    }
    else{
        for(var key in phoneBook){
            var temp = new Array();
            for (var key_person in phoneBook[key]){
                temp.push(phoneBook[key][key_person]);
            }
            console.log(temp.join(', '));
        }
    }
};

/**
 * Функция удаления записи в телефонной книге.
 * @param {string} query
*/
module.exports.remove = function remove(query) {
    if (query){
        var counter = 0;
        for(var key in phoneBook){
            if (key.indexOf(query) != -1){
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
    data =  data.split('\n');
    console.log(data);
    var params = new Array();
    for (var i = 0; i < data.length; i++){
     params = data[i].split(';');
     module.exports.add(params[0], params[1], params[2]);
    }
};

/**
  * Вспомогательные функция добивки пробелов.
  * @param {string} str, {number} len
  * @return {string} str
*/
function writeSpaces(str, len){
    for(var i = 0; i < len; i++){
        str += ' ';
    }
    return str;
};

/**
  * Функция вывода всех телефонов в виде ASCII.
*/
module.exports.showTable = function showTable() {
    var max_len_name = 0;
    var max_len_phone = 0;
    var max_len_email = 0;
    for(var key in phoneBook){
        for (var key_person in phoneBook[key]){
            var cur_len;
            if (key_person == 'name'){
                cur_len = phoneBook[key][key_person].length
                if (cur_len > max_len_name){
                    var max_len_name = cur_len;
                }
            }
            if (key_person == 'phone'){
                cur_len = phoneBook[key][key_person].length
                if (cur_len > max_len_phone){
                    var max_len_phone = cur_len;
                }
            }
            if (key_person == 'email'){
                cur_len = phoneBook[key][key_person].length
                if (cur_len > max_len_email){
                    var max_len_email = cur_len;
                }
            }
        }
    }
    max_len_name += 5;
    max_len_phone += 5;
    max_len_email += 5;
    var first_line = '┌';
    var second_line = '│';
    var third_line = '├';
    var last_string = '└';
    var all_len = max_len_name + max_len_phone + max_len_email;
    var div_1 = max_len_name;
    var div_2 = max_len_name + max_len_phone;
    for (var i = 0; i < all_len; i++){
        first_line += '-';
        third_line += '-';
        last_string += '-';
        if (i == div_1){
            first_line += '┬';
            third_line += '┼';
            last_string += '┴';
        }
        if (i == div_2){
            first_line += '╥';
            third_line += '╫';  
            last_string += '╨'; 
        }
        if (i == all_len - 1){
            first_line += '┐';
            third_line += '┤';
            last_string += '┘';
        }
    }
    var name_block = '  Имя';
    second_line += writeSpaces(name_block, max_len_name-name_block.length+1) + '│';
    var phone_block = '  Телефон';
    second_line += writeSpaces(phone_block, max_len_phone-phone_block.length) + '║';
    var email_block = '  email';
    second_line += writeSpaces(email_block, max_len_email-email_block.length-1) + '│';
    console.log(first_line);
    console.log(second_line);
    console.log(third_line);
    for(var key in phoneBook){
        var new_string = '│';
        for (var key_person in phoneBook[key]){
            if (key_person == 'name'){
                var person_name_block = '  ' + phoneBook[key][key_person];
                new_string += writeSpaces(person_name_block, max_len_name-person_name_block.length+1) + '│';
            }
            if (key_person == 'phone'){
                var person_phone_block = '  ' + phoneBook[key][key_person];
                new_string += writeSpaces(person_phone_block, max_len_phone-person_phone_block.length) + '║';
            }
            if (key_person == 'email'){
                var person_email_block = '  ' + phoneBook[key][key_person];
                new_string += writeSpaces(person_email_block, max_len_email-person_email_block.length-1) + '│';
            }
        }
        console.log(new_string);
    }
    console.log(last_string);
};

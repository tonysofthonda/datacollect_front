export const emailPattern: RegExp =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
export const alphabeticPattern: RegExp = /^[A-Za-z\s]+$/;
export const alphabeticPattern2: RegExp = /^[a-zA-Z]+[a-zA-Z\s]+$/;
export const alphaNumericPattern: RegExp = /^[A-Za-z\d\s]+$/;  
export const rfcPattern: RegExp = /[A-ZÑ&]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])(?:[A-Z\d]{3})/;
export const accountValuePattern: RegExp = /^-?(\d*\.)?\d+$|^\((\d*\.)?\d+\)$/;
export const codigoPostall: RegExp= /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/;


export const accountValueNumberPattern: RegExp = /^-?(\d*\.)?\d+$/;
export const accountValueParenthesesPattern: RegExp = /^\((\d*\.)?\d+\)$/;
export const accountValueNegativePattern: RegExp = /^-(\d*\.)?\d+$|^\((\d*\.)?\d+\)$/;
export const accountValueInputPattern: RegExp = /^-?(\d*\.)?\d+$|^\((\d*\.)?\d+\)$|^-?(\d*\.)?$|^\((\d*\.)?\)$|^\(\)$|^-?\.$|^-$|^\(\.\)$|^\($|^$/

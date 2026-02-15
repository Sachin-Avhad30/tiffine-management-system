import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomPasswordValidators {
  passwordValidity: string = '';
  StrongPasswordRegx: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  static noSpecialChar: RegExp = /^[a-zA-Z0-9]*$/;
  static lowerCase: RegExp = /[a-z]/;
  static upperCase: RegExp = /[A-Z]/;
  static numeral: RegExp = /[0-9]/;
  static logPatternError(): ValidatorFn {
    return (control: AbstractControl) => {
      // console.log("control:",control);
      const value = control.value;
      if (!this.numeral.test(value)) {
        return { noNumber: true };
      } else if (this.noSpecialChar.test(value)) {
        return { noSpecialChars: true };
      } else if (!this.lowerCase.test(value)) {
        return { noLowerCase: true };
      } else if (!this.upperCase.test(value)) {
        return { noUpperCase: true };
      } else {
        return null;
      }
    };
  }
}

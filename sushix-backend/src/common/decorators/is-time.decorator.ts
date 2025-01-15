import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsTime(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!(value instanceof Date) && typeof value !== 'string') {
            return false;
          }
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
          const timeString = value instanceof Date 
            ? value.toTimeString().split(' ')[0] 
            : value;
          return timeRegex.test(timeString);
        },
      },
    });
  };
} 
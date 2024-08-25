// eslint-disable-next-line max-classes-per-file
import { ApiPropertyOptions } from '@nestjs/swagger';

export class ApiInfo {
    description: string;
    example?: any;
    objectName?: string;
    propertyName?: string;
    options?: ApiPropertyOptions;
}

export class ApiPropertyConfig extends ApiInfo {
    children: string[];
    type?: any;
    // eslint-disable-next-line @typescript-eslint/ban-types
    decorators?: Function[];
    constraint?: string;
    isRequired?: boolean;
}

export class ApiResponseConfig extends ApiInfo {
    children: string[];
    type?: any;
}

export class ApiExceptionConfig extends ApiInfo {
    statusCode: string;
    errorCode: string;
    swaggerExample?: any;
}

export interface IGenHtmlConfig {
    mapNames: string[];
    headers: any;
    title?: string;
    description?: string;
}

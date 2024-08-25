import {
    ApiExceptionConfig,
    ApiPropertyConfig,
    ApiResponseConfig,
} from './api-info';

export class ObjectMap {
    static map: any[][] = [];
    static extends: any[] = [];

    static sign(
        config: ApiPropertyConfig | ApiExceptionConfig | ApiResponseConfig,
    ): void {
        if (ObjectMap.map[config.objectName]) {
            ObjectMap.map[config.objectName].push(config);
        } else {
            ObjectMap.map[config.objectName] = [config];
        }
    }

    static extend(objectName: string, _extends: any): void {
        ObjectMap.extends[objectName] = _extends;
    }

    static copyProperties(from: string, to: string): void {
        if (!ObjectMap.map[from] || !ObjectMap.map[to]) {
            throw new Error(`Object ${from} || ${to} is not exist!`);
        }
        for (const _from of ObjectMap.map[from]) {
            const index = ObjectMap.map[to].findIndex(
                (
                    data:
                        | ApiPropertyConfig
                        | ApiExceptionConfig
                        | ApiResponseConfig,
                ) => {
                    if (data.propertyName === _from.propertyName) {
                        return true;
                    }
                },
            );
            if (index < 0) {
                ObjectMap.map[to].push(_from);
            }
        }
    }
}

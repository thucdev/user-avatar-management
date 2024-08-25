export const TABLE_HEADER_TYPE = {
    API_PROPERTIES: {
        name: 'API_PROPERTIES',
        val: [
            'NAME',
            'TYPE',
            'CONSTRAINT',
            'IS REQUIRED',
            'DESCRIPTION',
            'EXAMPLE',
        ],
    },
    API_EXCEPTION: {
        name: 'API_EXCEPTION',
        val: ['NAME', 'STATUS CODE', 'MESSAGE CODE', 'DESCRIPTION', 'EXAMPLE'],
    },
    API_RESPONSE: {
        name: 'API_RESPONSE',
        val: ['NAME', 'TYPE', 'DESCRIPTION', 'EXAMPLE'],
    },
};

export enum ApiType {
    EXCEPTION = 'API_EXCEPTION',
    REQUEST = 'API_PROPERTY',
    RESPONSE = 'API_RESPONSE',
}

import { AISDK } from 'core/src/aisdk';

function initializeSDK() {
    const sdk = new AISDK();
    sdk.initialize({
        timeout: 3000,
        provider: 'openai'
    });
    return sdk;
}

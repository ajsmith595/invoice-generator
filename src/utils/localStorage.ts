

export interface LocalStorageData {
    name: string;
    bankDetails: {
        accountNumber: string;
        sortCode: string;
        name: string;
    },
    address: string[]
}

const LOCAL_STORAGE_KEY = 'invoice_generator_data';
export function getLocalData() {
    let data;
    try {
        const stringifiedData = localStorage.getItem(LOCAL_STORAGE_KEY) || '{}';
        data = JSON.parse(stringifiedData);
    } catch {
    }
    return {
        name: data?.name || '',
        bankDetails: {
            accountNumber: data?.bankDetails?.accountNumber || '',
            sortCode: data?.bankDetails?.sortCode || '',
            name: data?.bankDetails?.name || '',
        },
        address: data?.address || [],
    } as LocalStorageData;
}

export function setLocalData(data: LocalStorageData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}
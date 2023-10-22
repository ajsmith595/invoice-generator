import { Timestamp } from "firebase/firestore";


export interface ItemDescription {
    id?: string,
    name: string,
    quantity: number,
    unitPrice: number
}

export interface InvoiceDescriptor {
    id: string,
    invoiceeName: string,

    invoiceNumber: number,
    date: Timestamp,
    jobItems: string[],
    items: ItemDescription[]
}

export function randomString(length = 32) {
    const chars = 'ABCDEFabcdef0123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

export function getDefaultDescriptor(currentInvoices: InvoiceDescriptor[]): Omit<InvoiceDescriptor, 'id'> {
    const nextInvoiceNumber = currentInvoices.reduce(
        (prev, current) => Math.max(prev, Number(current.invoiceNumber) || 0),
        0
    ) + 1;
    console.log(currentInvoices);
    console.log('Next invoice number: ' + nextInvoiceNumber);
    return {
        invoiceeName: '',
        date: Timestamp.now(),
        invoiceNumber: nextInvoiceNumber,
        items: [{
            id: randomString(),
            name: '',
            quantity: 1,
            unitPrice: 0.00
        }],
        jobItems: ['']
    }
}
import React, { ReactElement, useState } from 'react';
import { InvoiceDescriptor } from './Invoice';
import _ from 'lodash';
import moment from 'moment';
import { Button } from './Common';
const LOCAL_STORAGE_KEY = 'invoicer_details';

function randomString(length = 32) {
    const chars = 'ABCDEFabcdef0123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

interface IProps {
    descriptor: InvoiceDescriptor | null;
    submitFn: (descriptor: InvoiceDescriptor) => void;
}
interface StoredData {
    invoiceNumber: number,
    invoicer: {
        accountNumber: string,
        sortCode: string,
        addressLines: string[],
        bankAccountName: string,
        name: string,
    }
}
function getDefaultDescriptor(): InvoiceDescriptor {

    let storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}') as Partial<StoredData>;

    return {
        invoiceeName: '',
        date: new Date(),
        invoiceNumber: storedData.invoiceNumber || 1,
        invoicer: {
            accountNumber: storedData.invoicer?.accountNumber || '',
            sortCode: storedData.invoicer?.sortCode || '',
            addressLines: storedData.invoicer?.addressLines || [''],
            bankAccountName: storedData.invoicer?.bankAccountName || '',
            name: storedData.invoicer?.name || '',
        },
        items: [{
            id: randomString(),
            name: '',
            quantity: 1,
            unitPrice: 0.00
        }],
        jobItems: ['']
    }
}

function saveDetails(descriptor: InvoiceDescriptor) {
    let saveObject: StoredData = {
        invoiceNumber: descriptor.invoiceNumber,
        invoicer: descriptor.invoicer
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveObject));
}

export {
    saveDetails
}

function Form(props: IProps) {

    const [descriptor, setDescriptor] = useState(props.descriptor);

    if (!descriptor) {
        setDescriptor(getDefaultDescriptor());
    }

    const inputClass = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

    const createInput = (label: string | null, placeholder: string, path: string, type: string = 'text', className = '') => {
        const onChange = (newValue: any) => {
            if (descriptor) {
                const newDescriptor = _.set(descriptor, path, newValue);
                setDescriptor({ ...newDescriptor });
            }
        };

        let input, resetButton: ReactElement | null = null;
        if (type === 'date') {
            const realValue: Date = _.get(descriptor, path);
            input = <input
                type={type}
                placeholder={placeholder}
                className={inputClass}
                onChange={(e) => {
                    onChange(moment(e.target.value).toDate())
                }}
                value={moment(realValue).format('YYYY-MM-DD')}
            />;

            resetButton = <Button className="float-right" onClick={() => onChange(new Date())}>Today</Button>;
        } else {
            input = <input
                className={inputClass}
                type={type}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                value={_.get(descriptor, path)}
            />;
        };
        let labelEl;
        if (label) labelEl = <label>{label}</label>;
        return <div className={className}>
            <div>
                {labelEl}
                {resetButton}
            </div>
            {input}
        </div>
    }

    const jobItems: Array<ReactElement> = [], items: Array<ReactElement> = [], addressLines: Array<ReactElement> = [];

    const arrayHandler = (arrayPath: string, elementArray: Array<ReactElement>, generateFn: (i: number) => ReactElement, keyFunc?: ((x: any) => string)) => {
        if (!descriptor) return;
        const arr: Array<any> = _.get(descriptor, arrayPath);
        keyFunc = keyFunc || ((i: string) => i);
        for (let i = 0; i < (arr.length || 0); i++) {
            elementArray.push(<div className="col-span-2 flex" key={keyFunc(i)}>
                <Button variant='danger' className="inline-block" onClick={() => {
                    arr.splice(i, 1);
                    setDescriptor({ ...descriptor });
                }}>Delete</Button>
                <Button variant='submit' className="inline-block" onClick={() => {
                    if (i === 0) return;
                    const old = arr[i - 1];
                    arr[i - 1] = arr[i];
                    arr[i] = old;
                    _.set(descriptor, arrayPath, arr);
                    setDescriptor({ ...descriptor });
                }}>Up</Button>
                <Button variant='submit' className="inline-block" onClick={() => {
                    if (i === arr.length - 1) return;
                    const old = arr[i + 1];
                    arr[i + 1] = arr[i];
                    arr[i] = old;
                    // const el = arr.splice(i, 1);
                    // arr.splice(i + 1, 0, el);
                    _.set(descriptor, arrayPath, arr);
                    setDescriptor({ ...descriptor });
                }}>Down</Button>
                {generateFn(i)}
            </div>);
        }
    }

    arrayHandler('invoicer.addressLines', addressLines, (i) => {
        return <>
            {createInput(null, '123 Something Drive', `invoicer.addressLines[${i}]`, 'text', 'flex-grow')}
        </>;
    });

    arrayHandler('jobItems', jobItems, (i) => {
        return <>
            {createInput(null, 'Mowed the lawn', `jobItems[${i}]`, 'text', 'flex-grow')}
        </>;
    });

    arrayHandler('items', items, (i) => {
        return <>
            {createInput('Item', 'Paint 500ml', `items[${i}].name`, 'text', 'flex-grow')}
            {createInput('Quantity', '1', `items[${i}].quantity`, 'number', 'flex-grow')}
            {createInput('Unit Price', '4.99', `items[${i}].unitPrice`, 'number', 'flex-grow')}
        </>;
    }, (i) => descriptor?.items[i].id || i);



    return (
        <div className="mx-auto w-1/2">
            <h1 className="text-3xl my-3">Invoice Details</h1>
            <div className="grid grid-cols-2">
                {createInput('Date', 'Date', 'date', 'date')}
                {createInput('Invoice Number', '1', 'invoiceNumber', 'number')}
                {createInput('Invoicee Name', 'John Smith', 'invoiceeName')}
                <hr className='my-3 col-span-2' />
                <div className='my-1 col-span-2'>
                    <h2 className='text-xl inline-block'>Invoicer Details</h2>
                    <Button className='float-right inline-block' onClick={() => {
                        if (descriptor) saveDetails(descriptor);
                    }}>Save Details</Button>
                </div>
                {createInput('Invoicer Name', 'John Smith', 'invoicer.name')}
                {createInput('Name on Payment Card', 'John Smith', 'invoicer.bankAccountName')}
                {createInput('Account Number', '12345678', 'invoicer.accountNumber')}
                {createInput('Sort Code', '12-34-56', 'invoicer.sortCode')}
                <div className='my-1 col-span-2'>
                    <h2 className='text-lg inline-block'>Address Lines</h2>
                    <Button className='float-right inline-block' variant='success' onClick={() => {
                        if (descriptor) {
                            descriptor.invoicer.addressLines.push('');
                            setDescriptor({ ...descriptor });
                        }
                    }}>Add New</Button>
                </div>
                {addressLines}
                <hr className='my-3 col-span-2' />
                <div className='my-1 col-span-2'>
                    <h2 className='text-xl inline-block'>Job Description</h2>
                    <Button className='float-right inline-block' variant='success' onClick={() => {
                        if (descriptor) {
                            descriptor.jobItems.push('');
                            setDescriptor({ ...descriptor });
                        }
                    }}>Add New</Button>
                </div>
                {jobItems}

                <hr className='my-3 col-span-2' />

                <div className='my-1 col-span-2'>
                    <h2 className='text-xl inline-block'>Items</h2>
                    <Button className='float-right inline-block' variant='success' onClick={() => {
                        if (descriptor) {
                            descriptor.items.push({
                                id: randomString(),
                                name: '',
                                quantity: 1,
                                unitPrice: 0
                            });
                            setDescriptor({ ...descriptor });
                        }
                    }}>Add New</Button>
                </div>
                {items}

                <hr className='my-3 col-span-2' />
                <Button className='col-span-2 py-4' onClick={() => descriptor && props.submitFn(descriptor)}>Submit</Button>
            </div>
        </div>
    );
}

export default Form;

import React, { ReactElement, useEffect, useState } from 'react';
import { InvoiceDescriptor, getDefaultDescriptor, randomString } from './utils/invoice';
import _, { initial } from 'lodash';
import moment from 'moment';
import { Button, Input, Title } from './Common';
import { useNavigate, useParams } from 'react-router-dom';
import { useFirebase } from './utils/firebaseContext';
import { Timestamp } from 'firebase/firestore';

function Form() {
    const { invoices, saveInvoice } = useFirebase();
    const { id } = useParams();
    const navigate = useNavigate();
    const initialDescriptor = invoices?.find(val => val.id === id);

    const [saving, setSaving] = useState(false);
    const [descriptor, setDescriptor] = useState(initialDescriptor || getDefaultDescriptor([]));


    const saveDescriptor = (descriptor: Omit<InvoiceDescriptor, 'id'>) => {
        setDescriptor(descriptor);
        setSaving(true);
    }
    useEffect(() => {
        const timeout = setTimeout(() => saveInvoice({
            id: id!,
            ...descriptor,
        }).then(() => {
            setSaving(false);
        }), 400);
        return () => clearTimeout(timeout);
    }, [descriptor]);

    if (!initialDescriptor) {
        return <p>Invoice not found!</p>;
    }



    const createInput = (label: string | null, placeholder: string, path: string, type: string = 'text', className = '') => {
        const onChange = (newValue: any) => {
            const newDescriptor = _.set(descriptor, path, newValue);
            saveDescriptor({ ...newDescriptor });
        };

        let input, resetButton: ReactElement | null = null;
        if (type === 'date') {
            const realValue: Date = _.get(descriptor, path).toDate();
            input = <Input
                type={type}
                placeholder={placeholder}
                onChange={(e) => {
                    onChange(Timestamp.fromDate(moment(e.target.value).toDate()))
                }}
                value={moment(realValue).format('YYYY-MM-DD')}
            />;

            resetButton = <Button className="float-right" onClick={() => onChange(Timestamp.now())}>Today</Button>;
        } else {
            input = <Input
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
                    saveDescriptor({ ...descriptor });
                }}>Delete</Button>
                <Button variant='submit' className="inline-block" onClick={() => {
                    if (i === 0) return;
                    const old = arr[i - 1];
                    arr[i - 1] = arr[i];
                    arr[i] = old;
                    _.set(descriptor, arrayPath, arr);
                    saveDescriptor({ ...descriptor });
                }}>Up</Button>
                <Button variant='submit' className="inline-block" onClick={() => {
                    if (i === arr.length - 1) return;
                    const old = arr[i + 1];
                    arr[i + 1] = arr[i];
                    arr[i] = old;
                    _.set(descriptor, arrayPath, arr);
                    saveDescriptor({ ...descriptor });
                }}>Down</Button>
                {generateFn(i)}
            </div>);
        }
    }

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
        <div>
            <Title>Invoice Details</Title>
            <div className="grid grid-cols-2">
                {createInput('Date', 'Date', 'date', 'date')}
                {createInput('Invoice Number', '1', 'invoiceNumber', 'number')}
                {createInput('Invoicee Name', 'John Smith', 'invoiceeName')}
                <hr className='my-3 col-span-2' />
                <div className='my-1 col-span-2'>
                    <h2 className='text-xl inline-block'>Job Description</h2>
                    <Button className='float-right inline-block' variant='success' onClick={() => {
                        if (descriptor) {
                            descriptor.jobItems.push('');
                            saveDescriptor({ ...descriptor });
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
                            saveDescriptor({ ...descriptor });
                        }
                    }}>Add New</Button>
                </div>
                {items}
                <hr className='my-3 col-span-2' />

                <h2 className='text-xl col-span-2'>Labour</h2>
                <div className='col-span-2 grid grid-cols-3'>
                    {createInput('Labour Description', '1 day @ £100 / day + 2 hrs @ £50 / hr ', 'labourDescription', 'textarea', 'col-span-2')}
                    {createInput('Labour Total', '142.82', 'labourTotal', 'number')}
                </div>

                <hr className='my-3 col-span-2' />
                <Button disabled={saving} className='col-span-2 py-4' onClick={() => {
                    navigate(`/view/${id}`);
                }}>Submit</Button>
            </div>
        </div>
    );
}

export default Form;
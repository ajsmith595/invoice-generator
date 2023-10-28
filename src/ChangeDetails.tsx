import _ from "lodash";
import { LocalStorageData, getLocalData, setLocalData } from "./utils/localStorage";
import React, { ReactElement } from "react";
import { Button, Input } from "./Common";




export function ChangeDetails() {
    const [details, setDetails] = React.useState(getLocalData());

    React.useEffect(() => {
        setLocalData(details);
    }, [details]);

    const createInput = (inputDataPath: string) => (
        <Input
            value={_.get(details, inputDataPath)}
            onChange={(e) => {
                setDetails(_.set({ ...details }, inputDataPath, e.target.value));
            }}
        />
    );


    const arrayHandler = (currentArray: Array<any>, setArray: (newArray: Array<any>) => void, generateFn: (i: number) => ReactElement, keyFunc?: ((x: any) => string)) => {
        keyFunc = keyFunc || ((i: string) => i);
        const elementArray = [];
        for (let i = 0; i < (currentArray.length || 0); i++) {
            elementArray.push(<div className="col-span-2 flex" key={keyFunc(i)}>
                <Button variant='danger' className="inline-block" onClick={() => {
                    const newArray = [...currentArray]
                    newArray.splice(i, 1);
                    setArray(newArray);
                }} tabIndex={-1}>Delete</Button>
                <Button variant='submit' className="inline-block" onClick={() => {
                    if (i === 0) return;
                    const newArray = [...currentArray];
                    const old = newArray[i - 1];
                    newArray[i - 1] = newArray[i];
                    newArray[i] = old;
                    setArray(newArray);
                }} tabIndex={-1}>Up</Button>
                <Button variant='submit' className="inline-block" onClick={() => {
                    if (i === currentArray.length - 1) return;
                    const newArray = [...currentArray];
                    const old = newArray[i + 1];
                    newArray[i + 1] = newArray[i];
                    newArray[i] = old;
                    setArray(newArray);
                }} tabIndex={-1}>Down</Button>
                {generateFn(i)}
            </div>);
        }
        return elementArray;
    }

    return (
        <div className="mx-auto w-1/2">
            <h1 className="text-3xl my-3">Change Details</h1>
            <small className="text-xs text-gray-500 mb-4 block">Your changes are automatically saved</small>
            <div>
                <label>Your Name</label>
                {createInput('name')}
            </div>
            <div>
                <label>Bank Account Holder's Name</label>
                {createInput('bankDetails.name')}
            </div>
            <div>
                <label>Account Number</label>
                {createInput('bankDetails.accountNumber')}
            </div>
            <div>
                <label>Sort Code</label>
                {createInput('bankDetails.sortCode')}
            </div>
            <div>
                <div className='my-1 col-span-2'>
                    <label>Address Lines</label>
                    <Button className='float-right inline-block' variant="success" onClick={() => setDetails({ ...details, address: [...details.address, ''] })} tabIndex={-1}>Add New</Button>
                </div>
                {arrayHandler(
                    details.address,
                    (newAddress) => setDetails({ ...details, address: newAddress }),
                    (i) => <Input
                        autoFocus
                        value={details.address[i]}
                        onChange={(e) => {
                            const newArray = [...details.address];
                            newArray[i] = e.target.value;
                            setDetails({ ...details, address: newArray })
                        }} />
                )}
            </div>
        </div>
    );
}
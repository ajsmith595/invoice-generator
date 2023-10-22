import { InvoiceDescriptor, ItemDescription } from "./utils/invoice";
import { LocalStorageData, getLocalData } from "./utils/localStorage";

interface IProps {
    descriptor: InvoiceDescriptor
}

function displayDeets(deets: LocalStorageData) {
    const x = [];
    x.push(<p key='name-line'>{deets.name}</p>);
    for (const line of deets.address) {
        x.push(<p key={line}>{line}</p>)
    }
    return x;
}

const border = 'border border-slate-500';
const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2
});
function generateItemRow(item: ItemDescription) {
    return (
        <tr key={item.id}>
            <td className={`${border}`}>{item.name}</td>
            <td className={`${border}`}>{item.quantity}</td>
            <td className={`${border}`}>{formatter.format(item.unitPrice)}</td>
            <td className={`${border}`}>{formatter.format(item.unitPrice * item.quantity)}</td>
        </tr>
    )
}

function Invoice(props: IProps) {
    let item_total = 0;
    for (const item of props.descriptor.items) {
        item_total += item.quantity * item.unitPrice;
    }
    let grand_total = Number(item_total) + Number(props.descriptor.labourTotal);
    const localDetails = getLocalData();
    return (
        <div>
            <h1 className='text-3xl font-bold'>Invoice #{props.descriptor.invoiceNumber}</h1>

            <div className="grid grid-cols-2 ">
                <div>
                    {displayDeets(localDetails)}
                </div>
                <div className="ml-auto mr-5 grid grid-cols-2">
                    <span className="font-bold">Name </span>
                    <p>{props.descriptor.invoiceeName}</p>
                    <span className="font-bold">Invoice # </span>
                    <p>{props.descriptor.invoiceNumber}</p>
                    <span className="font-bold">Date </span>
                    <p>{props.descriptor.date.toDate().toLocaleDateString()}</p>
                </div>
            </div>
            <br />
            <p className="font-bold text-xl">Job Description</p>
            <ul className="list-disc list-inside">
                {props.descriptor.jobItems.map((e, i) => <li key={i}>{e}</li>)}
            </ul>

            <table className={`border-collapse ${border} table-fixed w-full`}>
                <thead>
                    <tr>
                        <th className={`${border} w-7/12`}>Item</th>
                        <th className={`${border} w-1/12`}>Qty</th>
                        <th className={`${border} w-2/12`}>Unit Price</th>
                        <th className={`${border} w-2/12`}>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {props.descriptor.items.map(e => generateItemRow(e))}
                </tbody>
            </table>
            <hr className={`${border} opacity-10 my-3`} />
            <div className="grid grid-cols-3" style={{
                'gridTemplateColumns': '2fr 1fr 1fr'
            }}>
                <div className=""></div>
                <p className='font-bold text-lg text-right'>ITEM TOTAL:</p>
                <p className='font-bold text-lg text-right'>&nbsp;{formatter.format(item_total)}</p>
                <div className="">
                    <h1 className='text-lg font-bold'>Labour</h1>
                    <p className='whitespace-pre-wrap'>{props.descriptor.labourDescription}</p>
                    <br />
                </div>
                <p className='font-bold text-lg mt-auto text-right'>LABOUR TOTAL:</p>
                <p className='font-bold text-lg mt-auto text-right'>&nbsp;{formatter.format(props.descriptor.labourTotal)}</p>
                <div />
                <p className='font-bold text-lg underline text-right'>GRAND TOTAL:</p>
                <p className='font-bold text-lg underline text-right'>&nbsp;{formatter.format(grand_total)}</p>
            </div>
            <p className="text-lg font-bold">Account Details</p>
            <table className="table-auto text-left">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>{localDetails.bankDetails.name}</td>
                    </tr>
                    <tr>
                        <th>Account No</th>
                        <td>{localDetails.bankDetails.accountNumber}</td>
                    </tr>
                    <tr>
                        <th>Sort Code</th>
                        <td>{localDetails.bankDetails.sortCode}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}


export default Invoice;

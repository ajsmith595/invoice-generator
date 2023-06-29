

interface Deets {
    name: string,
    addressLines: string[],
    accountNumber: string,
    sortCode: string
}

interface ItemDescription {
    name: string,
    quantity: number,
    unitPrice: number
}

interface IProps {
    options: {
        invoicer: Deets,
        invoiceeName: string,

        invoiceNumber: number,
        date: Date,
        jobItems: string[],
        items: ItemDescription[]
    }
}

function displayDeets(deets: Deets) {
    const x = [];
    x.push(<p>{deets.name}</p>);
    for (const line of deets.addressLines) {
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
        <tr>
            <td className={`${border}`}>{item.name}</td>
            <td className={`${border}`}>{item.quantity}</td>
            <td className={`${border}`}>{formatter.format(item.unitPrice)}</td>
            <td className={`${border}`}>{formatter.format(item.unitPrice * item.quantity)}</td>
        </tr>
    )
}

function Invoice(props: IProps) {
    let total = 0;
    for (const item of props.options.items) {
        total += item.quantity * item.unitPrice;
    }
    return (
        <div>
            <h1 className='text-3xl font-bold'>Invoice #{props.options.invoiceNumber}</h1>

            <div className="grid grid-cols-2 ">
                <div>
                    {displayDeets(props.options.invoicer)}
                </div>
                <div className="ml-auto mr-5 grid grid-cols-2">
                    <span className="font-bold">Name </span>
                    <p>{props.options.invoiceeName}</p>
                    <span className="font-bold">Invoice # </span>
                    <p>{props.options.invoiceNumber}</p>
                    <span className="font-bold">Date </span>
                    <p>{props.options.date.toLocaleDateString()}</p>
                </div>
            </div>
            <br />
            <p className="font-bold text-xl">Job Description</p>
            <ul className="list-disc list-inside">
                {props.options.jobItems.map((e, i) => <li key={i}>{e}</li>)}
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
                    {props.options.items.map(e => generateItemRow(e))}
                </tbody>
            </table>
            <hr className={`${border} opacity-10 my-3`} />
            <div className="grid grid-cols-2 ">
                <div>
                </div>
                <div className="ml-auto mr-5 grid grid-cols-2 font-bold text-xl">
                    <p className="underline">TOTAL:</p>
                    <p>{formatter.format(total)}</p>
                </div>
            </div>
            <p className="text-lg font-bold">Account Details</p>
            <table className="table-auto text-left">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <p>{props.options.invoicer.name}</p>
                    </tr>
                    <tr>
                        <th>Account No</th>
                        <p>{props.options.invoicer.accountNumber}</p>
                    </tr>
                    <tr>
                        <th>Sort Code</th>
                        <p>{props.options.invoicer.sortCode}</p>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}


export default Invoice;
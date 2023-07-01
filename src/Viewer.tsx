import { useRef } from 'react';
import Invoice, { InvoiceDescriptor } from './Invoice';
import { Button } from './Common';
import { saveDetails } from './Form';

interface IProps {
    descriptor: InvoiceDescriptor;
    viewSwitchFunction: () => void;
}

function Viewer(props: IProps) {

    const invoiceRef = useRef<HTMLDivElement>(null);

    const printPdf = () => {
        if (invoiceRef.current) {
            saveDetails({
                ...props.descriptor,
                invoiceNumber: props.descriptor.invoiceNumber + 1
            })
            window.print();
        }
    };

    return (
        <>
            <div ref={invoiceRef}>
                <Invoice descriptor={props.descriptor} />
            </div>

            <div className='exclude-printing'>
                <Button onClick={printPdf}>Print as PDF</Button>
                <Button onClick={props.viewSwitchFunction}>Back</Button>
            </div>
        </>
    );
}

export default Viewer;

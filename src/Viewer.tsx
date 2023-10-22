import { useRef } from 'react';
import { Button } from './Common';
import { useNavigate, useParams } from 'react-router-dom';
import { useFirebase } from './utils/firebaseContext';
import Invoice from './Invoice';

function Viewer() {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const { invoices } = useFirebase();
    const { id } = useParams();
    const descriptor = invoices?.find(e => e.id === id);
    const navigate = useNavigate();
    const printPdf = () => {
        if (invoiceRef.current) {
            window.print();
        }
    };


    if (!descriptor) return <></>;

    return (
        <>
            <div ref={invoiceRef}>
                <Invoice descriptor={descriptor} />
            </div>

            <div className='exclude-printing'>
                <Button onClick={printPdf}>Print as PDF</Button>
            </div>
        </>
    );
}

export default Viewer;

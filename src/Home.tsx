import { useState } from 'react';
import { Button, Title } from './Common';
import { useFirebase } from './utils/firebaseContext';
import { useNavigate } from 'react-router-dom';
import { getDefaultDescriptor } from './utils/invoice';
import Modal from 'react-modal';


function Home() {
    const [disabled, setDisabled] = useState(false);
    const [deletionId, setDeletionId] = useState<string | null>(null);
    const { createInvoice, invoices, deleteInvoice } = useFirebase();
    const navigate = useNavigate();

    async function onClick() {
        setDisabled(true);
        const id = await createInvoice(getDefaultDescriptor(invoices!));
        id && navigate(`/edit/${id}`);
    }

    const invoiceElements = invoices?.reduce((prev, invoice) => {
        const id = invoice.id;
        const newElements = [
            <p key={`${id}_invoiceNumber`}>Invoice #{invoice.invoiceNumber}</p>,
            <p key={`${id}_invoiceeName`}>{invoice.invoiceeName}</p>,
            <p key={`${id}_date`}>{invoice.date?.toDate().toLocaleDateString()}</p>,
            <p key={`${id}_edit`}><Button variant='submit' onClick={() => navigate(`/edit/${invoice.id}`)}>Open/Edit</Button></p>,
            <p key={`${id}_view`}><Button variant='neutral' onClick={() => navigate(`/view/${invoice.id}`)}>View</Button></p>,
            <p key={`${id}_delete`}><Button variant='danger' onClick={() => setDeletionId(invoice.id)}>Delete</Button></p>,
        ];
        return [...prev, newElements] as JSX.Element[];
    }, [] as JSX.Element[]) || null;

    return (
        <div>
            <Title>Home</Title>
            <hr className='mb-4' />
            <Button variant='success' onClick={onClick} disabled={disabled}>Create New Invoice</Button>

            <div>
                <p>Existing invoices:</p>
                <div className='grid gap-y-1 invoice-grid-highlight' style={{ 'gridTemplateColumns': "10fr 10fr 2fr 1fr 1fr 1fr" }}>
                    {invoiceElements}
                </div>
            </div>

            <Modal isOpen={deletionId !== null} style={{
                content: {
                    top: '40%',
                    height: '15%',
                    left: '40%',
                    width: '20%',
                }
            }}>
                <p className='text-lg block text-center w-full'>Are you sure you want to delete this invoice?</p>
                <div className='absolute bottom-0 right-0 left-0 p-5'>
                    <Button variant='neutral' onClick={() => setDeletionId(null)}>Cancel</Button>
                    <Button variant='danger' className='float-right' onClick={async () => {
                        await deleteInvoice(deletionId!);
                        setDeletionId(null);
                    }}>Confirm Deletion</Button>
                </div>
            </Modal>
        </div>
    );
}

export default Home;

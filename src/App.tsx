import { useRef, useState } from 'react';
import Invoice, { InvoiceDescriptor } from './Invoice';
import Viewer from './Viewer';
import Form from './Form';

function App() {

	const [view, setView] = useState('form');
	const [descriptor, setDescriptor] = useState<InvoiceDescriptor | null>(null);

	const viewForm = () => {
		setView('form');
	}

	const submitForm = (newDescriptor: InvoiceDescriptor) => {
		setDescriptor(newDescriptor);
		setView('viewer');
	}

	let el = <p>Something went wrong...</p>;
	if (view === 'form') {
		el = <Form descriptor={descriptor} submitFn={submitForm} />;
	} else if (descriptor) {
		el = <Viewer viewSwitchFunction={viewForm} descriptor={descriptor} />
	}

	return (
		<div className="App">
			{el}
		</div>
	);
}

export default App;

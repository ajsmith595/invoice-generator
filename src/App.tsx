import React from 'react';
import Invoice from './Invoice';

function App() {
	return (
		<div className="App">
			<Invoice options={{
				invoicer: {
					name: 'Peter Smith',
					addressLines: [
						'Redacted Something Drive',
						'City',
						'ABC1 DEF',
					],
					accountNumber: '1234567',
					sortCode: '12-34-56',
				},
				invoiceeName: 'Peter Smith',
				invoiceNumber: 101,
				date: new Date(),
				jobItems: [
					'Fixed a fence post',
					'Drilled some concrete',
					'Disturbed some neighbours'
				],
				items: [
					{
						quantity: 10,
						name: 'Labour',
						unitPrice: 15
					},
					{
						quantity: 1,
						name: 'Tin 500ml smart ass paint',
						unitPrice: 3.15
					},
				]
			}} />
		</div>
	);
}

export default App;

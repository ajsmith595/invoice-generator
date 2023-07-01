
// compiled from API docs here: https://www.npmjs.com/package/html2pdf.js/v/0.9.0

type FromType = 'string' | 'element' | 'canvas' | 'img'
type ToTarget = 'container' | 'canvas' | 'img' | 'pdf';
type OutputType = 'pdf' | 'img';

type From = Element | string;
interface PdfGeneratorInstance {
    from: (src: From, type?: FromType) => PdfGeneratorInstance;
    to: (target: ToTarget) => PdfGeneratorInstance;


    output: (type: any, options: any, src: OutputType) => Promise<any>;
    outputPdf: (type: any, options: any) => Promise<any>;
    outputImg: (type: any, options: any) => Promise<any>;
    save: (filename: string) => void;
    /*
    output	type, options, src	Routes to the appropriate outputPdf or outputImg method based on specified src ('pdf' (default) or 'img').
    outputPdf	type, options	Sends type and options to the jsPDF object's output method, and returns the result as a Promise (use .then to access). See the jsPDF source code for more info.
    outputImg	type, options	Returns the specified data type for the image as a Promise (use .then to access). Supported types: 'img', 'datauristring'/'dataurlstring', and 'datauri'/'dataurl'.
    save	filename	Saves the PDF object with the optional filename (creates user download prompt).
    set	opt	Sets the specified properties. See Options below for more details.
    get	key, cbk	Returns the property specified in key, either as a Promise (use .then to access), or by calling cbk if provided.
    then	onFulfilled, onRejected	Standard Promise method, with this re-bound to the Worker, and with added progress-tracking (see Progress below). Note that .then returns a Worker, which is a subclass of Promise.
    thenCore	onFulFilled, onRejected	Standard Promise method, with this re-bound to the Worker (no progress-tracking). Note that .thenCore returns a Worker, which is a subclass of Promise.
    thenExternal	onFulfilled, onRejected	True Promise method. Using this 'exits' the Worker chain - you will not be able to continue chaining Worker methods after .thenExternal.
    catch, catchExternal	onRejected	Standard Promise method. catchExternal exits the Worker chain - you will not be able to continue chaining Worker methods after .catchExternal.
    error	msg	Throws an error in the Worker's Promise chain.

    */
}

declare module 'html2pdf.js' {
    function create(): PdfGeneratorInstance;

    export = create;
}

declare module 'react-datepicker' {
    const Element: React.Component;

    export = Element;
}
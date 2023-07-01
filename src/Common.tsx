interface IProps extends React.PropsWithChildren {
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    className?: string,
    variant?: 'neutral' | 'danger' | 'success' | 'submit'
}
function Button({ children, onClick, className = '', variant = 'neutral' }: IProps) {

    let colourFrom, hoverColour;
    switch (variant) {
        case 'danger': {
            colourFrom = 'bg-red-600';
            hoverColour = 'hover:bg-red-500';
            break;
        }
        case 'success': {
            colourFrom = 'bg-green-600';
            hoverColour = 'hover:bg-green-500';
            break;
        }
        case 'submit': {
            colourFrom = 'bg-blue-600';
            hoverColour = 'hover:bg-blue-500';
            break;
        }
        case 'neutral':
        default: {
            colourFrom = 'bg-slate-600';
            hoverColour = 'hover:bg-slate-500';
            break;
        }
    }


    return (
        <button
            className={`inline-block mx-1 ${colourFrom} ${hoverColour} transition-all px-2 text-white rounded ${className}`}
            onClick={onClick}>
            {children}
        </button>
    );
}

export {
    Button
};
interface IProps extends React.PropsWithChildren {
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    className?: string,
    variant?: 'neutral' | 'danger' | 'success' | 'submit' | 'blank',
    disabled?: boolean
}
function Button({ children, onClick, className = '', variant = 'neutral', disabled = false }: IProps) {
    let colourFrom, hoverColour, textColour = 'text-white';
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
        case 'blank': {
            textColour = 'text-gray-400';
            colourFrom = 'border-gray-200 border';
            hoverColour = 'hover:bg-black hover:bg-opacity-5 hover:text-gray-600 hover:border-gray-500';
            break;
        }
        case 'neutral':
        default: {
            colourFrom = 'bg-slate-600';
            hoverColour = 'hover:bg-slate-500';
            break;
        }
    }

    if (disabled) {
        hoverColour = 'opacity-30';
        console.log(colourFrom);
    }


    return (
        <button
            className={`inline-block mx-1 ${colourFrom} ${hoverColour} transition-all px-2 ${textColour} rounded ${className}`}
            onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}
function Input(props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
) {
    const inputClass = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
    return <input
        {...props}
        className={`${inputClass} ${props.className || ''}`}
    />
}
function Title(props: React.PropsWithChildren) {
    return <h1 className='text-3xl my-3'>{props.children}</h1>
}

export {
    Button,
    Input,
    Title
};
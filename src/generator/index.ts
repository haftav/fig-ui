import { scaffolda, createFile } from 'scaffolda';

const buttonProps = {
    width: 150,
    height: 40,
};

function Button(props: typeof buttonProps) {
    return `
  const Button = ({children}) => <button style={{ width: ${props.width}, height: ${props.height}}}>{children}</button>;

  export default Button;
  `;
}

export function runMe(directory: string) {
    scaffolda(directory, buttonProps, createFile(Button, 'button.tsx'));
}

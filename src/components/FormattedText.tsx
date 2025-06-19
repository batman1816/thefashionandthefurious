
interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText = ({ text, className = "" }: FormattedTextProps) => {
  if (!text) return null;
  
  return (
    <div 
      className={`whitespace-pre-wrap ${className}`}
      dangerouslySetInnerHTML={{ 
        __html: text
          .replace(/\n/g, '<br>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
      }}
    />
  );
};

export default FormattedText;


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
          .replace(/^• (.+)$/gm, '<li>$1</li>')
          .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
          .replace(/<\/ul><br><ul>/g, '')
      }}
    />
  );
};

export default FormattedText;

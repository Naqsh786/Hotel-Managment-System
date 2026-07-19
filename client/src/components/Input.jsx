
const Input = ({ label, icon: Icon, type = "text", name, value, onChange, placeholder, required = false, className = "" }) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="flex items-center gap-2">
          {Icon && <Icon size={16} />}
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="transition-all duration-300"
      />
    </div>
  );
};

export default Input;

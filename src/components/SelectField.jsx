import { ChevronDown } from './Icons.jsx';

/** Lista desplegable con el mismo estilo que los campos de texto. */
export default function SelectField({ id, label, value, onChange, options }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="select">
        <select id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="select__icon" />
      </div>
    </div>
  );
}

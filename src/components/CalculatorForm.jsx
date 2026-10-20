import NumberField from './NumberField.jsx';
import SelectField from './SelectField.jsx';

/**
 * Formulario de la modalidad activa. Recorre mode.fields con .map()
 * y dibuja un NumberField o un SelectField según el tipo de campo.
 */
export default function CalculatorForm({ mode, values, errors, onFieldChange, onSubmit }) {
  return (
    <form className="calc-form" onSubmit={onSubmit} noValidate aria-label={`Datos: ${mode.label}`}>
      {mode.fields.map((field) => {
        const id = `${mode.id}-${field.name}`;
        const common = {
          id,
          label: field.label,
          value: values[field.name],
          onChange: (v) => onFieldChange(field.name, v),
        };
        return field.kind === 'select' ? (
          <SelectField key={id} {...common} options={field.options} />
        ) : (
          <NumberField
            key={id}
            {...common}
            placeholder={field.placeholder}
            decimals={field.decimals}
            thousands={field.thousands ?? true}
            error={errors[field.name]}
          />
        );
      })}
      <button type="submit" className="btn btn--calc">
        Calcular
      </button>
    </form>
  );
}

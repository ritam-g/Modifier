import React from 'react'

const FormGroup = ({ label, placeholder, value, onChange, type = 'text', name, autoComplete }) => {
    const fieldId = (name || label).toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="form-group">
            <label htmlFor={fieldId}>{label}</label>
            <input
                value={value}
                onChange={onChange}
                type={type}
                id={fieldId}
                name={name || fieldId}
                autoComplete={autoComplete}
                placeholder={placeholder}
                required
            />
        </div>
    )
}

export default FormGroup

const FormInput = ({label, errormessage, onChange, id, ...inputProps}) => {

    return (
        <div>
            <input
                className="peer input-field dark:input-field-dark"
                {...inputProps}
                onChange={onChange}
            />
            <p className="hidden peer-invalid:block peer-invalid:mb-6 peer-invalid:mt-3 text-sm text-red-600 dark:text-red-500">
                {errormessage}
            </p>
        </div>
    );
};

export default FormInput;


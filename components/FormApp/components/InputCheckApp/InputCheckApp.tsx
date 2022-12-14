import { FormattedMessage } from "react-intl"
import style from './InputCheckApp.module.scss'

export interface INPUTCHECKBLOCKPROPS {
  labelID: string,
  onChange?: Function,
  onBlur?: Function,
  error?: string | undefined,
  name: string,
  formattedValues?: any,
  value?: any
}

/**
 * Función principal del componente checkbox del formulario
 * @param  labelID Key del json de traducción
 * @param  onChange Función para controlar el onchange de los inputs
 * @param  onBlur Función para controlar la pérdida del foco en los inputs
 * @param  error Error del campo de formulario
 * @param  name Name del campo
 * @param  formattedValues Formateo para texto enriquecido
 * @returns 
 */

const InputCheckApp = ({ labelID, formattedValues,value, error, name, onChange, onBlur }: INPUTCHECKBLOCKPROPS) => {

  const _handleChange = (target: HTMLInputElement) => {
   
    if (onChange) onChange(name, (value && target.checked) ? value : target.checked)
  }
  return (
    <>
      <div className={error ? `${style.hasError} ${style.inputContainer}` : style.inputContainer}>
        <label className={style.label}>
          <div>
            <input
              type='checkbox'
              name={name}
              autoComplete={'autocomplete'}
              onChange={(e) => _handleChange(e.target)}
              onBlur={() => { if (onBlur) onBlur() }}
              className={style.input}
            />
          </div>
          <span>
            <FormattedMessage id={labelID} values={formattedValues}/>
          </span>
        </label>
      </div>
      {error && (
        <div className={style.error}>{error}</div>
      )}
    </>
  )
}

export default InputCheckApp
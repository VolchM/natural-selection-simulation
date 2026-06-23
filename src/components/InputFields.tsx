import RandomizedStat from "../simulation/RandomizedStat";
import "./InputFields.css";

export type InputFieldProps = {
    value: number,
    min?: number,
    max?: number,
    title?: string,
    step?: number | string,
    onChange: (value: number) => void
}

export function InputField({ value, min, max, title, step = "any", onChange }: InputFieldProps): React.JSX.Element {
    function handleChange(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        e.target.reportValidity();
        onChange(e.target.valueAsNumber);
    }
    return <input className="input-field" type="number" title={title} value={isNaN(value) ? "" : value} min={min} max={max} step={step} onChange={handleChange} required />;
}

export type NumberInputProps = {
    label: string,
    value: number,
    min?: number,
    max?: number,
    step?: number | string,
    onChange: (value: number) => void;
}

export function NumberInput({ label, value, min, max, step = "any", onChange }: NumberInputProps): React.JSX.Element {
    return (
        <div className="input-row">
            <span>{label}</span>
            <InputField value={value} min={min} max={max} step={step} onChange={onChange} />
        </div>
    );
}

export type RandomizedStatInputProps = {
    label: string,
    value: RandomizedStat,
    min?: number,
    max?: number,
    onChange: (value: RandomizedStat) => void;
}

export function RandomizedStatInput({ label, value, min, max, onChange }: RandomizedStatInputProps): React.JSX.Element {
    function setMean(mean: number) {
        onChange(new RandomizedStat(mean, value.stdev));
    }
    function setStdev(stdev: number) {
        onChange(new RandomizedStat(value.mean, stdev));
    }

    let stdevMax: number | undefined = undefined;
    if (min !== undefined) {
        stdevMax = Math.floor((value.mean - min) / 3);
    }
    if (max !== undefined) {
        if (stdevMax === undefined) {
            stdevMax = Math.floor((max - value.mean) / 3);
        } else {
            stdevMax = Math.min(stdevMax, Math.floor((max - value.mean) / 3));
        }
    }

    return (
        <div className="input-row">
            <span style={{marginRight: "auto"}}>{label}</span>
            <div>
                <InputField title= "Среднее значение нормального распределения"
                            value={value.mean} min={min} max={max} step="any" onChange={setMean} />
                <span> ± </span>
                <InputField title={"Стандартное отклонение нормального распределения\nС вероятностью ~68% значение будет на расстоянии не более 1-го стандартного отклонения от среднего\n" +
                            "С вероятностью ~27% - между 1-м и 2-мя стандартными отклонениями\nС вероятностью ~5% - между 2-мя и 3-мя стандартными отклонениями (предел)"}
                            value={value.stdev} min={0} max={stdevMax} step="any" onChange={setStdev} />
            </div>
        </div>
    );
}

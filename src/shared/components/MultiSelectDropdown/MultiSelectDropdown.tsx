import styles from "./MultiSelectDropdown.module.scss";

export interface DropdownOption {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  id: string;
  label: string;
  options: DropdownOption[];
  selectedValues: string[];
  emptyMessage?: string;
  helperMessage?: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onClose: () => void;
  onChange: (values: string[]) => void;
}

export function MultiSelectDropdown({
  id,
  label,
  options,
  selectedValues,
  emptyMessage = "No options available",
  helperMessage,
  isOpen,
  onToggle,
  onClose,
  onChange,
}: MultiSelectDropdownProps) {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      onClose();
      return;
    }

    onChange([...selectedValues, value]);
    onClose();
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.trigger}
        type="button"
        aria-label={`${label} filter`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-dropdown`}
        onClick={() => onToggle(id)}
      >
        <span>{label}</span>

        {selectedValues.length > 0 && (
          <span className={styles.badge}>{selectedValues.length}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {helperMessage && <p className={styles.helper}>{helperMessage}</p>}

          {options.length ? (
            options.map((option) => (
              <label key={option.value} className={styles.option}>
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => toggleValue(option.value)}
                />

                <span>{option.label}</span>
              </label>
            ))
          ) : (
            <p className={styles.empty}>{emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";

import styles from "../styles/dropdown.module.css";

const Icon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
    </svg>
  );
};

export default function ({ placeHolder, options, set }) {

    const [showMenu, setShowMenu] = useState(false);
    const [selected, setSelected] = useState(placeHolder)

    const inputClicked = () => {
        setShowMenu(!showMenu)
    }

    const getDisplay = () => {
        return selected;
    };

    const optionSelected = (val) => {
        set(val);
        setSelected(val);
        inputClicked();
    }

    return (
        <div className={styles.dropdown_container}>
        <div className={styles.dropdown_input} onClick={() => inputClicked()}>
            <div className="dropdown-selected-value">{getDisplay()}</div>
            <div className="dropdown-tools">
            <div className="dropdown-tool">
                <Icon />
            </div>
            </div>
        </div>
        {showMenu ? <div className={styles.dropdown_menu}>
            {options.map((option) => (
                <div key={option.value} className={styles.dropdown_item} onClick={() => optionSelected(option.value)}>
                    {option.label}
                </div>
            ))}
        </div>
        :
        <></>}
        </div>
    );
};

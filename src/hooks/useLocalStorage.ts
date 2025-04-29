import { Dispatch, SetStateAction, useEffect, useState } from "react";

/**
 * The `useLocalStorage` hook is similar to useState in that it returns a state variable and a dispatch function to set that state.
 * The difference is that any value set by the setStorage dispatch is also automatically added to localStorage in addition to the
 * @param key - Local Storage key to access
 * @param {Object} initialValue - Any initial state of type T. If an initial state is provided, it will **overwrite** any currently existing value for the provided key.
 * @returns A tuple containing the current state value and a setter function.
 */
export const useLocalStorage = <T>(key: string, initialValue?: T) => {
    const [state, setState] = useState<T | undefined>(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (err) {
            console.error(`Error reading localStorage key "${key}":`, err);
            return initialValue;
        }
    });

    const setValue: Dispatch<SetStateAction<T | undefined>> = (
        value: SetStateAction<T | undefined>,
    ) => {
        try {
            const valueToStore =
                typeof value === "function"
                    ? (value as (prev: T | undefined) => T | undefined)(state)
                    : value;

            setState(value);
            if (typeof window !== "undefined" && valueToStore !== undefined) {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } else if (
                typeof window !== "undefined" &&
                valueToStore === undefined
            ) {
                window.localStorage.removeItem(key);
            }
        } catch (err) {
            console.error(`Error setting localStorage key "${key}":`, err);
        }
    };

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        try {
            const item = window.localStorage.getItem(key);
            setState(item ? JSON.parse(item) : initialValue);
        } catch (err) {
            console.error(
                `Error reading localStorage key "${key}" after key change:`,
                err,
            );
            setState(initialValue);
        }
    }, [key, initialValue]);

    return [state, setValue] as const;
};

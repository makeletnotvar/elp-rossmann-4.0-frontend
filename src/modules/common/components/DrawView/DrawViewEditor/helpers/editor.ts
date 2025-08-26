export function getInputNumberValue(input: HTMLInputElement): number {
    let value = Number(input.value);

    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (min && value <= min) value = min;
    if (max && value >= max) value = max;

    return value;
}
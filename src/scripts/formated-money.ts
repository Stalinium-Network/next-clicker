export default function formatMoney(value: number) {
    if (value >= 1e15)
        return value.toExponential(4)

    if (value >= 1e12)
        return `${(value / 1e12).toFixed(2)} T`

    if (value >= 1e9)
        return `${(value / 1e9).toFixed(2)} B`

    if (value >= 1e6)
        return `${(value / 1e6).toFixed(2)} M`

    // Тысячи, добавляем разделение пробелами для лучшей читаемости
    if (value >= 1e3)
        return value.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    
    return value.toFixed()
}
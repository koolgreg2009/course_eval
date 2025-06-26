export const setNumberColors = (val: number): string => {
    if (val > 5){
        return 'text-secondary';
    }
    if (val >= 4){
        return 'text-success';
    } else if (val < 3){
        return 'text-error';
    }
    return 'text-warning';
}


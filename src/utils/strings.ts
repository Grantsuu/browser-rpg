// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
export const toTitleCase = (str: string) => {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
};
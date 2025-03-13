interface ItemCategoryBadgeProps {
    category: string;
};

// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
const toTitleCase = (str: string) => {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
};

const ItemCategoryBadge = ({ category }: ItemCategoryBadgeProps) => {
    return (
        // Admittedly terrible way to do this but its the only way the webpacker will work with the CSS
        // Weapon
        (category === 'weapon') ?
            <span className="badge badge-sm badge-primary">
                {toTitleCase(category)}
                {/* Accessory */}
            </span> : (category === 'accessory') ?
                <span className="badge badge-sm badge-secondary">
                    {toTitleCase(category)}
                    {/* Consumable */}
                </span> : (category === 'consumable') ?
                    <span className="badge badge-sm badge-accent">
                        {toTitleCase(category)}
                    </span> : (category === 'armor') ?
                        <span className="badge badge-sm badge-neutral">
                            {toTitleCase(category)}
                        </span> : (category === 'material') ?
                            <span className="badge badge-sm badge-success">
                                {toTitleCase(category)}
                            </span> :
                            <span className="badge badge-sm badge-error">
                                {toTitleCase(category)}
                            </span>
    );
};

export default ItemCategoryBadge;
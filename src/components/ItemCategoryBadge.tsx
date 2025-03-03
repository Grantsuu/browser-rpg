type ItemCategory = 'weapon' | 'accessory' | 'consumable' | 'armor' | 'material';

interface ItemCategoryBadgeProps {
    category: ItemCategory;
};

// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
const toTitleCase = (str: string) => {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

const ItemCategoryBadge = ({ category }: ItemCategoryBadgeProps) => {
    const badgeClassString = "badge badge-soft badge-sm badge-".concat(
        category === 'weapon' ? 'primary' :
            category === 'accessory' ? 'secondary' :
                category === 'consumable' ? 'accent' :
                    category === 'armor' ? 'neutral' :
                        category === 'material' ? 'info' :
                            'error');

    return (
        <span className={badgeClassString}>
            {toTitleCase(category)}
        </span>
    );
};

export default ItemCategoryBadge;
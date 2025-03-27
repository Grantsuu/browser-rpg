import { useEffect, useState } from 'react';
import { toTitleCase } from '../utils/strings';

interface ItemCategoryBadgeProps {
    category: string;
};

const ItemCategoryBadge = ({ category }: ItemCategoryBadgeProps) => {
    const [badgeStyle, setBadgeStyle] = useState(category);

    useEffect(() => {
        switch (category) {
            case 'weapon':
                setBadgeStyle('badge-primary');
                break;
            case 'accessory':
                setBadgeStyle('badge-secondary');
                break;
            case 'consumable':
                setBadgeStyle('badge-accent');
                break;
            case 'armor':
                setBadgeStyle('badge-neutral');
                break;
            case 'material':
                setBadgeStyle('badge-success');
                break;
            default:
                setBadgeStyle('badge-error');
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <span className={`badge badge-sm ${badgeStyle}`}>
            {toTitleCase(category)}
        </span>
    );
};

export default ItemCategoryBadge;
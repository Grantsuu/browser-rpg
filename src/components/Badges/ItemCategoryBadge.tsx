import { useEffect, useState } from 'react';
import { toTitleCase } from '../../utils/strings';

interface ItemCategoryBadgeProps {
    category: string;
};

const ItemCategoryBadge = ({ category }: ItemCategoryBadgeProps) => {
    const [badgeStyle, setBadgeStyle] = useState(category);

    useEffect(() => {
        switch (category) {
            // TODO: remove when category is removed from database
            case 'weapon':
                setBadgeStyle('badge-primary');
                break;
            // TODO: remove when category is removed from database
            case 'accessory':
                setBadgeStyle('badge-secondary');
                break;
            case 'consumable':
                setBadgeStyle('badge-accent');
                break;
            // TODO: remove when category is removed from database
            case 'armor':
                setBadgeStyle('badge-neutral');
                break;
            case 'material':
                setBadgeStyle('badge-success');
                break;
            case 'equipment':
                setBadgeStyle('badge-primary');
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
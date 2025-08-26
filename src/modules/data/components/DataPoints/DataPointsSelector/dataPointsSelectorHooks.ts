import React, { useState } from "react";
import { stringComparator } from "helpers/data";

export function useFilter(buildings: Reference[]) {
    const [filterQuery, setFilterQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState<Reference[]>(buildings);

    React.useEffect(() => {
        let nextFiltered: Reference[] = buildings;

        if (filterQuery !== '') {
            nextFiltered = buildings.filter(b => stringComparator(b.name, filterQuery));
        }

        setFilteredItems(nextFiltered);
    }, [filterQuery, buildings]);

    return {
        filteredItems,
        setFilterQuery,
        filterQuery,
        isActive: filterQuery !== ''
    }
}
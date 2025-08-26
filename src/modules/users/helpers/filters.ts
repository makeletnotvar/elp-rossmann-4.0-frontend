import { sortBy } from "lodash";

/**
 * Sorting by @active and @type props
 * but with always current logged user on top
 * 
 */
export const sortUsers = (users: User[], currentUsername?: string): User[] => {
    const sortedByActive = sortBy(users, user => !user.active);
    const sortedByType = sortBy(sortedByActive, user => user.type);
    return sortBy(sortedByType, user => user.username !== currentUsername)
}
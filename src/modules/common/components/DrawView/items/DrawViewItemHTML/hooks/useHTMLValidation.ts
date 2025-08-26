import { useEffect, useMemo, useState } from "react";

const BLACKLIST: string[] = [
    '<script',
    '<link',
    '<iframe',
    '<frame'
];

export default (html: string): string | null => {
    const [error, setError] = useState<string | null>(null);

    const foundBlacklistItem = useMemo(() => {
        return BLACKLIST.find(word => (html || '').toLowerCase().includes(word))
    }, [html]);

    useEffect(() => {
        if (foundBlacklistItem) {
            setError(`Użycie obiektu ${foundBlacklistItem} jest zakazane!`);
        } else {
            setError(null);
        }
    }, [foundBlacklistItem]);

    return error;
};